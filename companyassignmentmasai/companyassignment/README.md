# Fintarget-Functionup-PythonTask

# WebSocket Data Processing

This Python script connects to a WebSocket server to fetch and process real-time financial data, including Last Traded Price (LTP), Open, Low, High, Close (OLHC) data, and calculates Simple Moving Averages (SMA).

## Features

- Fetches real-time financial data using WebSocket communication.
- Processes data for Nifty, Banknifty, and Finnifty simultaneously.
- Calculates and updates OLHC data for a one-minute interval.
- Calculates and updates Simple Moving Averages (SMA) with a window of 3.

## Prerequisites

- Python 3.x
- `websocket-client` library

## Installation

Install the required dependencies using the following command:

```bash
pip install websocket-client
Usage
Run the script:

bash
Copy code
python script.py
Connects to the WebSocket server and starts receiving Last Traded Price (LTP) messages.

Processes the received data simultaneously for Nifty, Banknifty, and Finnifty.

Converts the data into one-minute OLHC data and records data for 1 hour in a CSV format.

Calculates and updates Simple Moving Averages (SMA) with a window of 3.

File Structure
script.py: Main Python script that connects to the WebSocket server and processes data.
olhc_data.csv: CSV file containing OLHC data.
sma_data.csv: CSV file containing Simple Moving Averages (SMA) data.
Data Structure
OLHC Data
Timestamp: Timestamp in the format "dd-mm-yyyy HH:MM:SS".
Open: Opening price of the asset.
Low: Lowest price observed during the one-minute interval.
High: Highest price observed during the one-minute interval.
Close: Closing price of the asset at the end of the one-minute interval.
Simple Moving Averages (SMA) Data
Timestamp: Timestamp in the format "dd-mm-yyyy HH:MM:SS".
SMA: Simple Moving Average calculated over a window of 3
