import requests
import pandas as pd
from io import StringIO
import numpy as np

url = "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv"
response = requests.get(url)

if response.status_code == 200:
    df = pd.read_csv(StringIO(response.text))
    print(np.array(df.Symbol))
else:
    print(f"Error: {response.status_code}")

