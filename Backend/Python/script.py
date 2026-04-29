import yfinance as yf

ticker = yf.Ticker("DIS")
for key, value in ticker.info.items():
    print(f"{key:<40} {value}")

