import requests
import time

# Function to ping the proxy server
def ping_server(target_url):
    proxy_url = f'https://thingproxy-oxuk.onrender.com/fetch/{target_url}'
    try:
        response = requests.get(proxy_url)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")
        if response.status_code == 200:
            print("Ping successful.")
        else:
            print("Ping failed with status code:", response.status_code)
    except requests.exceptions.RequestException as e:
        print("Ping failed:", e)

# Main loop to ping the server at regular intervals
target_url = 'http://example.com'  # Replace with the actual target URL you want to fetch
while True:
    ping_server(target_url)
    time.sleep(300)  # Sleep for 5 minutes (300 seconds)