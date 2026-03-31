from config import config
from webApp.flask_srvr import run_flask
import threading
import time

t = threading.Thread(target=run_flask)
t.daemon = True
t.start()

print(config.id)

# Keep main thread alive
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutting down...")