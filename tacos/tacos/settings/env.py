import os
from uuid import uuid4

SECRET_KEY = os.environ.get("SECRET_KEY", str(uuid4()))

DEBUG = bool(int(os.environ.get('DEBUG', 1)))

CONSERVATION_TIME = int(os.environ.get("CONSERVATION_TIME", 3600))
LOCAL_FOLDER_LOTTIE_FILES = os.environ.get("LOCAL_FOLDER_LOTTIE_FILES")
if LOCAL_FOLDER_LOTTIE_FILES is not None and not os.path.exists(LOCAL_FOLDER_LOTTIE_FILES):
    os.makedirs(LOCAL_FOLDER_LOTTIE_FILES)
LOCAL_FILE_CONFIG = 'chicken_tacos_config.csv'

HOST = os.environ.get("HOST")
FRONT = os.environ.get("FRONT")

FIGMA_API_URL = os.environ.get("FIGMA_API_URL")
FIGMA_APP_CLIENT_ID = os.environ.get("FIGMA_APP_CLIENT_ID")
FIGMA_APP_CLIENT_SECRET = os.environ.get("FIGMA_APP_CLIENT_SECRET")

TEST_ACCESS_TOKEN = os.environ.get("TEST_ACCESS_TOKEN")
TEST_REFRESH_TOKEN = os.environ.get("TEST_REFRESH_TOKEN")
TEST_FIGMA_URL = os.environ.get("TEST_FIGMA_URL")

CELERY_BROKER_URL = 'amqp://localhost'
