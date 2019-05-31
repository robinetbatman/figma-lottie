"""
Settings separated in multiple files
"""
import re
import os


def read_env():
    """Pulled from oncho code with minor updates, reads local default
    environment variables from a .env file located in the project root
    directory.
    """
    try:
        with open(".env") as f:
            content = f.read()
    except (IOError, UnicodeDecodeError):
        content = ""

    for line in content.splitlines():
        m1 = re.match(r'\A([A-Za-z_0-9]+)=(.*)\Z', line)
        if m1:
            key, val = m1.group(1), m1.group(2)
            m2 = re.match(r'\A"(.*)"\Z', val)
            if m2:
                val = m2.group(1)
            m3 = re.match(r'\A"(.*)"\Z', val)
            if m3:
                val = re.sub(r'\\(.)", r"\1', m3.group(1))
            os.environ.setdefault(key, val)


read_env()

# Django framework settings, database and email connection information
from tacos.settings.django import *

# Custom env variables
from tacos.settings.env import *
