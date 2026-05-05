from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
import yfinance as yf
import pandas as pd


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
    

# FOR MAIN PAGE SCREENER
# 1. Get S&P 500 list --> still not working
headers = {"User-Agent": "Mozilla/5.0"}

@app.get("/api/snp500")
def get_sp500_list():
    try:
        data = requests.get(
            "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv"
        )
        from io import StringIO
        df = pd.read_csv(StringIO(data.text))
        tickers = df["Symbol"].str.replace(".", "-", regex=False).tolist()
        return {"tickers": tickers}
    except Exception as e:
        print(f"Error: {e}")
        return {"tickers": []}


# # Cache S&P 500 list to avoid repeated web scraping for Wikipedia 
# SP500 = get_sp500_list()


# # 2. Simple cache for screener data
# cache = {
#     "data": None,
#     "timestamp": 0
# }

# CACHE_TTL = 60  # seconds before cache expires


# # 3. Fetch stock data in batch 
# def fetch_data(symbols):
#     return yf.download(
#         tickers=symbols,
#         # yesterday and today's data to compute change %
#         period="2d",
#         interval="1d",
#         group_by="ticker",
#         threads=True
#     )

# # 4. Build screener dataset
# def build_screener():
#     data = fetch_data(SP500)

#     results = []

#     for symbol in SP500:
#         try:
#             df = data[symbol]
#             # today's and yesterday's data to compute change %
#             latest = df.iloc[-1]
#             previous = df.iloc[-2]
#             # current and yesterday's closing price to compute change %
#             price = float(latest["Close"])
#             prev_close = float(previous["Close"])

#             change_pct = ((price - prev_close) / prev_close) * 100
#             # number of shares traded today
#             volume = int(latest["Volume"])

#             results.append({
#                 "symbol": symbol,
#                 "price": round(price, 2),
#                 "change_percent": round(change_pct, 2),
#                 "volume": volume
#             })

#         except:
#             continue

#     return results


# # 5. Cached screener 
# def get_cached_screener():
#     now = time.time()
#     # if cache is still valid
#     if cache["data"] and now - cache["timestamp"] < CACHE_TTL:
#         return cache["data"]

#     data = build_screener()

#     cache["data"] = data
#     cache["timestamp"] = now

#     return data


# # 6. Sorting functions
# def top_gainers(data):
#     return sorted(data, key=lambda x: x["change_percent"], reverse=True)[:25]


# def top_losers(data):
#     return sorted(data, key=lambda x: x["change_percent"])[:25]


# def most_active(data):
#     return sorted(data, key=lambda x: x["volume"], reverse=True)[:25]


# # 7. API endpoint
# @app.get("/api/screener")
# def screener(type: str = "gainers"):
#     data = get_cached_screener()

#     if type == "gainers":
#         return top_gainers(data)

#     if type == "losers":
#         return top_losers(data)

#     if type == "active":
#         return most_active(data)

#     return data


# # Every time frontend calls:
# #/api/screener?type=gainers

# #Your backend:
# # Gets list of S&P 500 stocks
# # Downloads price data for all of them
# # Computes price change + volume
# # Sorts them (gainers / losers / active)
# # Returns top 25