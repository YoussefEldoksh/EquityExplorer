from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
import yfinance as yf
import pandas as pd
import requests
from io import StringIO
import numpy as np
import time
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

# FOR STOCK DETAIL PAGE
@app.get("/api/stock/{symbol}")
def get_stock_data(symbol: str):
    ticker = yf.Ticker(symbol)
    return ticker.info

@app.get("/api/timeseries/{symbol}")
def get_stock_timeseries(symbol: str, period: str = "1mo", interval: str = "1d"):
    try:
        ticker = yf.Ticker(symbol.upper())
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            return {}
        
        hist.index = hist.index.strftime("%Y-%m-%d %H:%M:%S")
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

def fetch_ticker(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
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
    except:
        return None

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
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(fetch_ticker, tickers))
    return [r for r in results if r is not None]

def get_cached_screener():
    now = time.time()
    if cache["data"] and now - cache["timestamp"] < CACHE_TTL:
        return cache["data"]
    data = build_screener()
    cache["data"] = data
    cache["timestamp"] = now
    return data

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