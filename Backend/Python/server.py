from fastapi import FastAPI, HTTPException, Cookie, Depends
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import requests
from io import StringIO
import time
import os
import jwt
import psycopg2
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# DB Connection Helper
def get_db_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS")
    )

# Helper to set RLS context for current user
def set_user_context(conn, user_id):
    """Set PostgreSQL session variable for RLS policies"""
    try:
        cur = conn.cursor()
        cur.execute("SELECT set_config('app.current_user_id', %s, false)", (user_id,))
        cur.close()
    except Exception as e:
        print(f"Warning: Failed to set user context: {e}")

# Auth Helper
async def get_current_user(token: Optional[str] = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        # user_id is now a UUID string from JWT payload 'sub'
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM], options={"verify_sub": False})
        user_id = payload.get("sub")
        print(payload)
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id  # UUID string
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# FOR STOCK DETAIL PAGE
@app.get("/api/stock/{symbol}")
def get_stock_data(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        if not info:
            raise HTTPException(status_code=404, detail="Stock not found")
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/timeseries/{symbol}")
def get_stock_timeseries(symbol: str, period: str = "1mo", interval: str = "1d"):
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            return {}
        
        hist.index = pd.DatetimeIndex(hist.index).strftime("%Y-%m-%d %H:%M:%S")
        return hist[["Open", "High", "Low", "Close", "Volume"]].to_dict(orient="index")
    except Exception as e:
        print(f"Error: {e}")
        return {}
    
@app.get("/api/index")
def get_index_data(symbols: str):
    try:
        ticker_list = [s.strip() for s in symbols.split(",")]
        result = {}
        for symbol in ticker_list:
            ticker = yf.Ticker(symbol)
            result[symbol] = ticker.info
        return result
    except Exception as e:
        print(f"Error: {e}")
        return {}



cache = {"data": None, "timestamp": 0}
CACHE_TTL = 300  # 5 minutes

import requests
import time
import sys

yf_session = requests.Session()
yf_session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0"
})

def fetch_ticker(symbol, retries=2):
    for attempt in range(retries):
        try:
            ticker = yf.Ticker(symbol, session=yf_session)
            info = ticker.info
            # sometimes info is empty or misses regularMarketPrice if rate limited
            if not info or "regularMarketPrice" not in info:
                if attempt < retries - 1:
                    time.sleep(1)
                    continue
            return {
                "symbol": info.get("symbol"),
                "name": info.get("longName"),
                "vol": info.get("volume"),
                "pe": info.get("trailingPE"),
                "eps": info.get("trailingEps"),
                "price": info.get("regularMarketPrice"),
                "div": info.get("dividendYield"),
                "changePct": info.get("regularMarketChangePercent"),
                "sector": info.get("sector"),
                "marketCap": info.get("marketCap"),
            }
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1.5)
            else:
                print(f"Fetch error for {symbol} (attempt {attempt+1}): {e}", file=sys.stderr)
                return {
                    "symbol": symbol,
                    "name": "N/A",
                    "vol": 0,
                    "pe": 0,
                    "eps": 0,
                    "price": 0,
                    "div": 0,
                    "changePct": 0,
                    "sector": "N/A",
                    "marketCap": 0,
                }

def get_sp500_data():
    url = "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv"
    response = requests.get(url)
    df = pd.read_csv(StringIO(response.text))
    # Replace . with - for yfinance compatibility (e.g. BRK.B -> BRK-B)
    df["Symbol"] = df["Symbol"].str.replace(".", "-", regex=False)
    return df.rename(columns={"Security": "Name"})[["Symbol", "Name"]].to_dict("records")

# Cache for search suggestions
stock_list_cache = []

def get_stock_list():
    global stock_list_cache
    if not stock_list_cache:
        try:
            stock_list_cache = get_sp500_data()
        except Exception as e:
            print(f"Error loading stock list: {e}")
            return []
    return stock_list_cache

@app.get("/api/search/suggestions")
def get_suggestions(q: str):
    if not q:
        return []
    
    q = q.strip().upper()
    stocks = get_stock_list()
    
    # Priority 1: Exact symbol match
    # Priority 2: Symbol prefix match
    # Priority 3: Name match
    
    exact_symbol = []
    symbol_prefix = []
    name_match = []
    
    for stock in stocks:
        symbol = stock["Symbol"].upper()
        name = stock["Name"].upper()
        
        if symbol == q:
            exact_symbol.append(stock)
        elif symbol.startswith(q):
            symbol_prefix.append(stock)
        elif q in name:
            name_match.append(stock)
            
    # Combine and limit
    results = exact_symbol + symbol_prefix + name_match
    # Remove duplicates while preserving order
    seen = set()
    unique_results = []
    for r in results:
        if r["Symbol"] not in seen:
            unique_results.append({
                "symbol": r["Symbol"],
                "name": r["Name"]
            })
            seen.add(r["Symbol"])
            
    return unique_results[:8]

def get_sp500_tickers():
    data = get_stock_list()
    return [s["Symbol"] for s in data]

def build_screener():
    sp500_data = get_stock_list()[:100]
    tickers = [s["Symbol"] for s in sp500_data]
    try:
        # yf.download bypasses the strict 401 Unauthorized errors that .info gets
        hist = yf.download(tickers, period='5d', progress=False)
        results = []
        for stock in sp500_data:
            symbol = stock["Symbol"]
            try:
                series_close = hist['Close'][symbol].dropna()
                series_vol = hist['Volume'][symbol].dropna()
                
                if len(series_close) < 2:
                    continue
                    
                price = float(series_close.iloc[-1])
                prev_price = float(series_close.iloc[-2])
                vol = float(series_vol.iloc[-1])
                changePct = ((price - prev_price) / prev_price) * 100 if prev_price else 0
                
                results.append({
                    "symbol": symbol,
                    "name": stock["Name"],
                    "vol": vol,
                    "pe": 0,
                    "eps": 0,
                    "price": price,
                    "div": 0,
                    "changePct": changePct,
                    "sector": "N/A",
                    "marketCap": 0,
                })
            except Exception as e:
                pass
        return results
    except Exception as e:
        import sys
        print(f"Screener bulk download failed: {e}", file=sys.stderr)
        return []

def get_cached_screener():
    now = time.time()
    if cache["data"] and now - cache["timestamp"] < CACHE_TTL:
        return cache["data"]
    data = build_screener()
    # Only cache if data isn't mostly rate-limited zeroes
    valid_count = sum(1 for d in data if d.get("price", 0) != 0)
    if valid_count > len(data) / 2:
        cache["data"] = data
        cache["timestamp"] = now
    return data

# WATCHLIST ENDPOINTS
@app.post("/api/watchlist/add")
async def add_to_watchlist(symbol: str, user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO watchlist (user_id, symbol) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (user_id, symbol.upper())
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True, "message": f"{symbol} added to watchlist"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/api/watchlist")
async def get_watchlist(user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute("SELECT symbol FROM watchlist WHERE user_id = %s", (user_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [row[0] for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/watchlist/details")
async def get_watchlist_details(user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute("SELECT symbol FROM watchlist WHERE user_id = %s", (user_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        symbols = [row[0] for row in rows]
        if not symbols:
            return []
            
        with ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(fetch_ticker, symbols))
            
        return [r for r in results if r is not None]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/watchlist/remove/{symbol}")
async def remove_from_watchlist(symbol: str, user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute(
            "DELETE FROM watchlist WHERE user_id = %s AND symbol = %s",
            (user_id, symbol.upper())
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True, "message": f"{symbol} removed from watchlist"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AlertRequest(BaseModel):
    symbol: str
    target_price: float
    condition: str # 'above' or 'below'

# PRICE ALERT ENDPOINTS
@app.post("/api/alerts/add")
async def add_alert(alert: AlertRequest, user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO price_alerts (user_id, symbol, target_price, condition) VALUES (%s, %s, %s, %s)",
            (user_id, alert.symbol.upper(), alert.target_price, alert.condition.lower())
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True, "message": f"Alert set for {alert.symbol} at {alert.target_price}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/alerts")
async def get_alerts(user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute("SELECT id, symbol, target_price, condition, is_active FROM price_alerts WHERE user_id = %s", (user_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        # Fetch current prices for each symbol
        alerts_with_price = []
        for row in rows:
            symbol = row[1]
            try:
                # We can cache this or fetch in parallel, but for now, simple fetch
                ticker = yf.Ticker(symbol)
                current_price = ticker.info.get("regularMarketPrice") or ticker.info.get("currentPrice")
            except:
                current_price = None
                
            alerts_with_price.append({
                "id": row[0],
                "symbol": symbol,
                "target_price": float(row[2]),
                "condition": row[3],
                "is_active": row[4],
                "current_price": current_price
            })
        return alerts_with_price
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/alerts/remove/{alert_id}")
async def remove_alert(alert_id: int, user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute("DELETE FROM price_alerts WHERE id = %s AND user_id = %s", (alert_id, user_id))
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True, "message": "Alert removed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/alerts/toggle/{alert_id}")
async def toggle_alert(alert_id: int, user_id: str = Depends(get_current_user)):
    try:
        conn = get_db_conn()
        set_user_context(conn, user_id)  # Set RLS context
        cur = conn.cursor()
        cur.execute("UPDATE price_alerts SET is_active = NOT is_active WHERE id = %s AND user_id = %s", (alert_id, user_id))
        conn.commit()
        cur.close()
        conn.close()
        return {"success": True, "message": "Alert toggled"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/snp500")
def screener(type: str = "all"):
    data = get_cached_screener()
    if type == "gainers":
        return sorted(data, key=lambda x: x["changePct"] or 0, reverse=True)[:25]
    if type == "losers":
        return sorted(data, key=lambda x: x["changePct"] or 0)[:25]
    if type == "active":
        return sorted(data, key=lambda x: x["vol"] or 0, reverse=True)[:25]
    return data