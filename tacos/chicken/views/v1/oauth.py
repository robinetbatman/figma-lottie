from uuid import uuid4

import requests
from django.http import JsonResponse
from django.shortcuts import redirect

from chicken.utils.oauth import get_oauth_callback
from tacos import settings

from django.core.cache import cache

############################################
#
#   /v1/api/oauth
#
############################################


def oauth(request):
    if request.method != 'GET':
        return JsonResponse(status=405, data={})

    state = str(uuid4())
    cache.set('state', state, 60)

    url = f'https://www.figma.com/oauth?client_id={settings.FIGMA_APP_CLIENT_ID}' \
        f'&redirect_uri={get_oauth_callback()}' \
        f'&scope=file_read&state={state}' \
        f'&response_type=code'

    return redirect(url)


############################################
#
#   /v1/api/oauth/callback
#
############################################


def oauth_callback(request):
    if request.method != 'GET':
        return JsonResponse(status=405, data={})

    if request.GET.get('state') != cache.get('state'):
        return JsonResponse(status=403, data={"error": "Oauth state invalid"})

    response = requests.post(f'https://www.figma.com/api/oauth/token?client_id={settings.FIGMA_APP_CLIENT_ID}'
                             f'&client_secret={settings.FIGMA_APP_CLIENT_SECRET}'
                             f'&redirect_uri={get_oauth_callback()}'
                             f'&code={request.GET.get("code")}'
                             f'&grant_type=authorization_code').json()

    if 'access_token' not in response or 'refresh_token' not in response:
        return JsonResponse(status=400, data=response)
    uuid = str(uuid4())
    cache.set(f'{uuid}_access_token', response['access_token'], 18000)
    cache.set(f'{uuid}_refresh_token', response['refresh_token'], 18000)

    return redirect(f'{settings.FRONT}?oauth=OK&uuid={uuid}')
