import logging
import os
import threading
import time
import requests
from queue import Queue, Empty

# =========================
# ⚙️ ENV CONFIG
# =========================
BOT_TOKEN = os.getenv("LOGGER_BOT_TKN")
CHAT_ID = os.getenv("LOGGER_CHAT_ID")

print("🔑 BOT_TOKEN:", BOT_TOKEN)
print("💬 CHAT_ID:", CHAT_ID)

if not BOT_TOKEN or not CHAT_ID:
    print("❌ ERROR: ENV variables missing!")
    print("Set LOGGER_BOT_TKN and LOGGER_CHAT_ID")
    

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

        print("📨 Telegram response:", res.text)

        # fallback if markdown fails
        if not res.ok and use_markdown:
            print("⚠️ Markdown failed, retrying without markdown...")
            return send_to_telegram(text, use_markdown=False)

    except Exception as e:
        print("❌ Telegram send error:", e)


# =========================
# 🔁 WORKER THREAD
# =========================
def telegram_worker():
    print("🚀 Telegram worker started")

    buffer = []
    last_flush = time.time()

    while True:
        try:
            log = log_queue.get(timeout=1)
            print("📥 Got log from queue")
            buffer.append(log)
        except Empty:
            pass

        now = time.time()

        if buffer and (len(buffer) >= BATCH_SIZE or now - last_flush >= FLUSH_INTERVAL):
            print(f"📤 Sending batch ({len(buffer)} logs)")
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

            log_entry = self.format(record)

            formatted = (
                f"{emoji} *{level}*\n"
                f"`{record.threadName}`\n"
                f"{log_entry}"
            )

            print("📥 Adding log to queue")
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

    # Console
    console = logging.StreamHandler()
    console.setFormatter(formatter)
    logger.addHandler(console)

    # Telegram
    tg_handler = TelegramBatchHandler()
    tg_handler.setFormatter(formatter)
    logger.addHandler(tg_handler)

    # Start worker
    t = threading.Thread(target=telegram_worker, daemon=True)
    t.start()

    # =========================
    # 🧪 TEST MESSAGE
    # =========================
    print("🧪 Sending test message...")

    send_to_telegram("✅ Logger Started Successfully 🚀")

    logging.info("Logger initialized ✅")
