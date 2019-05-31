import os

import pandas as pd
from uuid import uuid4
from django.utils import timezone
from tacos import settings


def create_row(figma_url, access_token, refresh_token):
    url = str(uuid4())
    return ({
                'figma_url': figma_url,
                'created_at': timezone.now(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }, url)


def get_local_lottie_file_name(url, filename):
    return "{}_{}".format(url, filename)


def get_config_file_path():
    return f'{settings.LOCAL_FOLDER_LOTTIE_FILES}/{settings.LOCAL_FILE_CONFIG}'


def get_config_df():
    # Check if csv file already exists
    config_file_path = get_config_file_path()
    if os.path.isfile(config_file_path):
        with open(config_file_path, 'r') as f:
            df = pd.read_csv(f, index_col='url')
    else:
        df = pd.DataFrame(
            columns=['url', 'figma_url', 'lottie_files', 'created_at', 'access_token', 'refresh_token'])
        df = df.set_index('url')
    return df
