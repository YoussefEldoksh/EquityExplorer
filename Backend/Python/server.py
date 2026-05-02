from fastapi import FastAPI
import yfinance as yf

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/stock/{symbol}")
def get_stock_data(symbol: str):
    ticker = yf.Ticker(symbol)
    return ticker.info