import json
import os

import pandas as pd
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from chicken import tasks
from chicken.utils.figma import get_frame_info
from chicken.utils.oauth import refresh_token, get_access_token, get_refresh_token
from chicken.utils.views.api import create_row, get_local_lottie_file_name
from chicken.utils.views.api import get_config_df, get_config_file_path
from tacos import settings


############################################
#
#   /v1/form
#
############################################


def form(request):
    if request.method != 'GET':
        return JsonResponse(status=405, data={})

    figma_url = request.GET.get('figma_url')
    uuid = request.GET.get('uuid')

    if figma_url is None or uuid is None:
        return JsonResponse(status=400, data={"error": "Required GET parameters: 'figma_url' and 'uuid"})

    access_token = get_access_token(uuid)
    refresh_token = get_refresh_token(uuid)

    if access_token is None or refresh_token is None:
        return JsonResponse(status=403, data={"error": "Oauth login required beforehands"})

    frame_info = get_frame_info(figma_url, access_token)

    if 'error' in frame_info:
        return JsonResponse(status=frame_info['status'], data={'error': frame_info['error']})

    # Create the entry in csv file to generate the url
    row, url = create_row(
        figma_url, access_token, refresh_token)
    series = pd.Series(row, name=url)
    df = get_config_df()
    df = df.append(series)
    df.to_csv(get_config_file_path())
    # After some time, remove the entry and the associated files
    tasks.clean_files.apply_async(args=[url, get_config_file_path()], countdown=settings.CONSERVATION_TIME)

    frame_info['url'] = url
    return JsonResponse(status=200, data=frame_info)


############################################
#
#   /v1/lottie
#
############################################

@csrf_exempt
def lottie(request):
    if request.method != 'POST':
        return JsonResponse(status=405, data={})

    url = request.GET.get('url')
    df = get_config_df()

    if url is None:
        return JsonResponse(status=400, data={"error": "Required GET parameter: 'url"})

    if url not in df.index:
        return JsonResponse(status=400, data={"error": "Unknown url"})

    # Get uploaded files
    lottie_files = {}
    for filename in request.FILES:
        uploaded_file = request.FILES[filename]
        if not uploaded_file.name.endswith('.json'):
            continue

        local_filename = get_local_lottie_file_name(url, filename)

        file_path = os.path.join(settings.LOCAL_FOLDER_LOTTIE_FILES, local_filename)
        with open(file_path, 'wb') as local_file:
            local_file.write(uploaded_file.read())

        lottie_files[filename] = local_filename

    df.loc[url, 'lottie_files'] = json.dumps(lottie_files)
    df.to_csv(get_config_file_path())

    return JsonResponse(status=204, data={})


############################################
#
#   /v1/preview/<str:url>
#
############################################


def preview(request, url):
    if request.method != 'GET':
        return HttpResponse(status=405)

    df = get_config_df()

    # Check if url exists
    if url not in df.index:
        return HttpResponse(status=404)

    row = df.loc[url]

    lottie_files_json = json.loads(row['lottie_files'])
    lottie_files = {}
    for key in lottie_files_json:
        file_path = os.path.join(settings.LOCAL_FOLDER_LOTTIE_FILES, lottie_files_json[key])
        with open(file_path, 'rb') as f:
            animation = f.read()
        lottie_files[key] = json.loads(animation.decode('utf-8'))

    frame_info = get_frame_info(row['figma_url'], row['access_token'])

    if 'error' in frame_info and frame_info['status'] == 403:
        # Invalid token: Update access_token in config file
        df.loc[url, 'access_token'] = refresh_token(row["refresh_token"], request)
        df.to_csv(get_config_file_path())

    frame_info = get_frame_info(row['figma_url'], row['access_token'])
    frame_info['lottie_files'] = lottie_files

    return JsonResponse(status=200, data=frame_info)
