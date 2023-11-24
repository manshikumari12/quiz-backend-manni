import os
import websocket
import json
import pandas as pd
from datetime import datetime
from statistics import mean

WEBSOCKET_URL = "wss://functionup.fintarget.in/ws?id=fintarget-functionup"
YOUR_CSV_FILENAME = "olhc_stock_data.csv"
YOUR_WINDOW_SIZE = 3

additional_files = ["moving_averages_Finnifty.csv", "moving_averages_Banknifty.csv", "moving_averages_Nifty.csv", YOUR_CSV_FILENAME]

for filename in additional_files:
    if os.path.exists(filename):
        os.remove(filename)
        print(f"Cleaned existing file: {filename}")

olhc_data = {instrument: [] for instrument in ["Nifty", "Banknifty", "Finnifty"]}
moving_averages_data = {}

def on_message(ws, message):
    data = json.loads(message)
    process_data(data)

def process_data(data):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for instrument, ltp in data.items():
        olhc_data[instrument].append({
            "Timestamp": timestamp,
            "Open": ltp,
            "Low": ltp,
            "High": ltp,
            "Close": ltp
        })

        # Save CSV file after every new entry
        df = pd.DataFrame(olhc_data[instrument][-1:])  # Select only the last entry
        with open(YOUR_CSV_FILENAME, 'a+', newline='') as f:
            # Write header only if the file is newly created
            if f.tell() == 0:
                df.to_csv(f, index=False)
            else:
                df.to_csv(f, index=False, header=False)

            f.flush()

        if len(olhc_data[instrument]) >= YOUR_WINDOW_SIZE:
            close_prices = [entry["Close"] for entry in olhc_data[instrument][-YOUR_WINDOW_SIZE:]]
            ma = mean(close_prices)

            # Add the new moving average value to the corresponding instrument's dictionary
            moving_averages_data.setdefault(instrument, []).append({"Timestamp": timestamp, "MovingAverage": ma})

            # Save moving averages data to separate CSV file for each instrument
            if instrument not in moving_averages_data:
                continue

            df_ma = pd.DataFrame(moving_averages_data[instrument][-1:])  # Select only the last entry
            filename = f"moving_averages_{instrument}.csv"

            with open(filename, 'a+', newline='') as f_ma:
                # Write header only if the file is newly created
                if f_ma.tell() == 0:
                    df_ma.to_csv(f_ma, index=False)
                else:
                    df_ma.to_csv(f_ma, index=False, header=False)

                f_ma.flush()

            print(f"Moving Average for {instrument}: {ma}")

# Connect to WebSocket
def connect_to_websocket():
    ws = websocket.WebSocketApp(WEBSOCKET_URL, on_message=on_message)
    ws.run_forever()

if __name__ == "__main__":
    connect_to_websocket()
