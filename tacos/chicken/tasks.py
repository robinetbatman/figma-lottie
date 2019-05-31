import json
import os

import pandas as pd
from celery import shared_task

from chicken.utils.views.api import get_local_lottie_file_name
from tacos import settings


@shared_task
def clean_files(url, config_file_path):
    if not os.path.isfile(config_file_path):
        return

    with open(config_file_path, 'r') as f:
        df = pd.read_csv(f, index_col='url')
        # Remove local files
        try:
            lottie_files = json.loads(df.loc[url, 'lottie_files'])
            for filename in lottie_files.keys():
                os.remove(os.path.join(settings.LOCAL_FOLDER_LOTTIE_FILES, get_local_lottie_file_name(url, filename)))
        except TypeError:
            # No file saved
            pass
        # Remove row
        df = df.drop(url, axis=0)
        df.to_csv(config_file_path)
