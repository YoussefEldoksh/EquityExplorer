import yfinance as yf
import pandas as pd
# ticker = yf.Ticker("DIS")
# for key, value in ticker.info.items():
#     print(f"{key:<40} {value}")

table = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")[0]
print(table.head())