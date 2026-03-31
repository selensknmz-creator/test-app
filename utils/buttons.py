from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from typing import List

# ------------------------
# Single button helper
# ------------------------
def Btn(text: str, callback: str = None, url: str = None, web_app: str = None) -> InlineKeyboardButton:
    """
    Create a single InlineKeyboardButton
    - callback: callback_data for button
    - url: open URL
    - web_app: open Telegram Web App
    """
    if callback:
        return InlineKeyboardButton(text, callback_data=callback)
    elif url:
        return InlineKeyboardButton(text, url=url)
    elif web_app:
        return InlineKeyboardButton(text, web_app=WebAppInfo(url=web_app))
    else:
        raise ValueError("Button needs either callback, url, or web_app")

# ------------------------
# Row helper
# ------------------------
def row(*buttons: InlineKeyboardButton) -> List[InlineKeyboardButton]:
    """
    Create a row of buttons
    """
    return list(buttons)

# ------------------------
# Markup helper
# ------------------------
def Markup(button_rows: List[List[InlineKeyboardButton]]) -> InlineKeyboardMarkup:
    """
    Convert button rows into InlineKeyboardMarkup
    """
    return InlineKeyboardMarkup(button_rows)

# ------------------------
# Optional: Dynamic buttons from list
# ------------------------
def dynamic_buttons(items: list, prefix: str = "item"):
    """
    Generate buttons from a list of items
    callback_data will be prefix_index
    """
    buttons = []
    for i, item in enumerate(items, 1):
        buttons.append([Btn(item, f"{prefix}_{i}")])
    return Markup(buttons)