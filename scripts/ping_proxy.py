import requests
import time

# Function to ping the proxy server
def ping_server():
    url = 'https://your-proxy-server-url'  # Replace with your proxy server URL
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Ping successful.")
        else:
            print("Ping failed with status code:", response.status_code)
    except requests.exceptions.RequestException as e:
        print("Ping failed:", e)

# Main loop to ping the server at regular intervals
while True:
    ping_server()
    time.sleep(300)  # Sleep for 5 minutes (300 seconds)