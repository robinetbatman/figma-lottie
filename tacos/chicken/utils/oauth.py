import requests

from tacos import settings
from django.urls import reverse
from django.core.cache import cache


def get_oauth_callback():
    return f'{settings.HOST}{reverse("v1-oauth_callback")}'


def get_access_token(uuid):
    return cache.get(f'{uuid}_access_token')


def get_refresh_token(uuid):
    return cache.get(f'{uuid}_refresh_token')


def refresh_token(value_refresh_token, request):
    # Refresh token
    response = requests.post(f'https://www.figma.com/api/oauth/refresh?client_id={settings.FIGMA_APP_CLIENT_ID}'
                             f'&client_secret={settings.FIGMA_APP_CLIENT_SECRET}'
                             f'&refresh_token={value_refresh_token}').json()
    access_token = response['access_token']

    # Update access_token in session
    request.session['access_token'] = access_token
    return access_token
