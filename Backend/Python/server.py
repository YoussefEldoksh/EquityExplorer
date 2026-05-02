from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
import yfinance as yf



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

@app.get("/api/stock/{symbol}")
def get_stock_data(symbol: str):
    ticker = yf.Ticker(symbol)
    return ticker.info

@app.get("/api/timeseries/{symbol}")
def get_stock_timeseries(symbol: str, period: str = "1mo", interval: str = "1d"):
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=period, interval=interval)
    hist.index = hist.index.strftime("%Y-%m-%d")  # convert datetime index to string
    return hist[["Open", "High", "Low", "Close", "Volume"]].to_dict(orient="index")