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
import asyncio
import json
from contextlib import asynccontextmanager
from yahooquery import Ticker as YQTicker

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



async def update_screener_cache_task():
    while True:
        try:
            print("Fetching screener data for cache...")
            data = await asyncio.to_thread(build_screener)
            if data:
                conn = get_db_conn()
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO application_cache (key, data, updated_at) 
                    VALUES ('screener', %s, CURRENT_TIMESTAMP)
                    ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
                """, (json.dumps(data),))
                conn.commit()
                cur.close()
                conn.close()
                print("Screener cache updated.")
        except Exception as e:
            print(f"Error updating screener cache: {e}")
        
        await asyncio.sleep(12 * 60 * 60) # 12 hours

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(update_screener_cache_task())
    yield
    task.cancel()

app = FastAPI(lifespan=lifespan)

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
        t = YQTicker(ticker_list)
        price_data = t.price
        result = {}
        for symbol in ticker_list:
            if isinstance(price_data, dict) and symbol in price_data and isinstance(price_data[symbol], dict):
                result[symbol] = price_data[symbol]
        return result
    except Exception as e:
        print(f"Error: {e}")
        return {}





def fetch_ticker(symbol, delay=0):
    try:
        if delay > 0:
            import time
            time.sleep(delay)
            
        t = YQTicker(symbol)
        
        # YahooQuery returns a dictionary keyed by symbol
        p = t.price.get(symbol, {}) if isinstance(t.price, dict) else {}
        sd = t.summary_detail.get(symbol, {}) if isinstance(t.summary_detail, dict) else {}
        sp = t.summary_profile.get(symbol, {}) if isinstance(t.summary_profile, dict) else {}
        ks = t.key_stats.get(symbol, {}) if isinstance(t.key_stats, dict) else {}

        if not p or isinstance(p, str) or p.get("regularMarketPrice") is None:
            raise Exception("Rate limited or empty info")
            
        return {
            "symbol": symbol,
            "name": p.get("longName", p.get("shortName", "N/A")),
            "vol": sd.get("volume", 0),
            "pe": sd.get("trailingPE", 0),
            "eps": ks.get("trailingEps", 0),
            "price": p.get("regularMarketPrice", 0),
            "div": sd.get("dividendYield", 0),
            "changePct": (p.get("regularMarketChangePercent", 0) * 100) if p.get("regularMarketChangePercent") else 0,
            "sector": sp.get("sector", "N/A"),
            "marketCap": p.get("marketCap", 0),
        }
    except Exception as e:
        print(f"Fetch failed for {symbol}: {e}")
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
    tickers = get_sp500_tickers()
    results = []
    chunk_size = 20
    
    for i in range(0, len(tickers), chunk_size):
        chunk = tickers[i:i + chunk_size]
        with ThreadPoolExecutor(max_workers=5) as executor:
            # Add a tiny delay between individual threads in a chunk
            chunk_results = list(executor.map(lambda x: fetch_ticker(x, delay=0.1), chunk))
            
        for res in chunk_results:
            if res is not None:
                results.append(res)
                
        # Sleep between blocks of 20 to avoid rate limits
        time.sleep(2)
        
    return [r for r in results if r is not None]

def get_cached_screener():
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT data FROM application_cache WHERE key = 'screener'")
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row and row[0]:
            return row[0]
    except Exception as e:
        print(f"Error reading screener cache: {e}")
    return []

def get_stock_data_from_cache_or_yf(symbols):
    cache_data = get_cached_screener()
    cache_dict = {s["symbol"]: s for s in cache_data}
    
    results = []
    missing_symbols = []
    
    for symbol in symbols:
        if symbol in cache_dict:
            results.append(cache_dict[symbol])
        else:
            missing_symbols.append(symbol)
            
    if missing_symbols:
        with ThreadPoolExecutor(max_workers=2) as executor:
            fetched = list(executor.map(fetch_ticker, missing_symbols))
        for r in fetched:
            if r is not None:
                results.append(r)
                
    return results

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
            
        return get_stock_data_from_cache_or_yf(symbols)
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
        symbols = list(set([row[1] for row in rows]))
        stock_data_list = get_stock_data_from_cache_or_yf(symbols) if symbols else []
        stock_price_dict = {s["symbol"]: s["price"] for s in stock_data_list}
        
        alerts_with_price = []
        for row in rows:
            symbol = row[1]
            alerts_with_price.append({
                "id": row[0],
                "symbol": symbol,
                "target_price": float(row[2]),
                "condition": row[3],
                "is_active": row[4],
                "current_price": stock_price_dict.get(symbol)
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
def screener(type: str = "all", page: int = 1, limit: int = 50):
    data = get_cached_screener()
    
    if type == "gainers":
        data = sorted(data, key=lambda x: x["changePct"] or 0, reverse=True)
    elif type == "losers":
        data = sorted(data, key=lambda x: x["changePct"] or 0)
    elif type == "active":
        data = sorted(data, key=lambda x: x["vol"] or 0, reverse=True)
        
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    return {
        "data": data[start_idx:end_idx],
        "total": len(data),
        "page": page,
        "limit": limit,
        "totalPages": (len(data) + limit - 1) // limit if limit > 0 else 0
    }