import logging
import os
import threading
import time
import requests
import re
from queue import Queue, Empty

# =========================
# ⚙️ ENV CONFIG
# =========================
BOT_TOKEN = os.getenv("LOGGER_BOT_TKN")
CHAT_ID = os.getenv("LOGGER_CHAT_ID")

if not BOT_TOKEN or not CHAT_ID:
    print("❌ ERROR: LOGGER_BOT_TKN or LOGGER_CHAT_ID missing!")

# =========================
# 🎨 LEVEL EMOJIS
# =========================
LEVEL_EMOJI = {
    "DEBUG": "⚪",
    "INFO": "🟢",
    "WARNING": "🟡",
    "ERROR": "🔴",
    "CRITICAL": "🔥"
}

# =========================
# 🧹 ANSI CLEANER (FIX FLASK LOGS)
# =========================
ANSI_ESCAPE = re.compile(r'\x1B\[[0-?]*[ -/]*[@-~]')

def clean_log(text):
    return ANSI_ESCAPE.sub('', text)

# =========================
# 📦 QUEUE CONFIG
# =========================
log_queue = Queue()
BATCH_SIZE = 5
FLUSH_INTERVAL = 3  # seconds

# =========================
# 📤 TELEGRAM SEND
# =========================
def send_to_telegram(text, use_markdown=True):
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

        data = {
            "chat_id": CHAT_ID,
            "text": text[:4000]
        }

        if use_markdown:
            data["parse_mode"] = "Markdown"

        res = requests.post(url, data=data, timeout=5)

        # Markdown fail → retry plain text
        if not res.ok and use_markdown:
            return send_to_telegram(text, use_markdown=False)

    except Exception as e:
        print("❌ Telegram send error:", e)

# =========================
# 🔁 WORKER THREAD
# =========================
def telegram_worker():
    buffer = []
    last_flush = time.time()

    while True:
        try:
            log = log_queue.get(timeout=1)
            buffer.append(log)
        except Empty:
            pass

        now = time.time()

        if buffer and (len(buffer) >= BATCH_SIZE or now - last_flush >= FLUSH_INTERVAL):
            text = "\n\n".join(buffer)
            send_to_telegram(text)

            buffer.clear()
            last_flush = now

# =========================
# 🧠 CUSTOM HANDLER
# =========================
class TelegramBatchHandler(logging.Handler):
    def emit(self, record):
        try:
            level = record.levelname
            emoji = LEVEL_EMOJI.get(level, "⚪")

            log_entry = clean_log(self.format(record))

            formatted = (
                f"{emoji} *{level}*\n"
                f"`{record.threadName}`\n"
                f"{log_entry}"
            )

            log_queue.put(formatted)

        except Exception as e:
            print("❌ Handler error:", e)

# =========================
# 🚀 SETUP LOGGER
# =========================
def setup_telegram_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s\n%(message)s"
    )

    # Console handler
    console = logging.StreamHandler()
    console.setFormatter(formatter)
    logger.addHandler(console)

    # Telegram handler
    tg_handler = TelegramBatchHandler()
    tg_handler.setFormatter(formatter)
    logger.addHandler(tg_handler)

    # Reduce Flask/Werkzeug spam logs
    logging.getLogger("werkzeug").setLevel(logging.WARNING)

    # Start worker thread
    t = threading.Thread(target=telegram_worker, daemon=True)
    t.start()

    # Test message
    send_to_telegram("✅ *Logger Started Successfully* 🚀")

    logging.info("Logger initialized ✅")
