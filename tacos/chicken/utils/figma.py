import re
from urllib.parse import unquote

import requests

from tacos import settings


def get_file_key(figma_url):
    res = re.search('/file/(.*)/', figma_url)
    if res is not None:
        return res.group(1)
    else:
        return None


def get_node_id(figma_url):
    res = re.search('\?node-id=(.*)$', figma_url)
    if res is not None:
        return unquote(res.group(1))
    else:
        return None


def api_request(endpoint, token):
    response = requests.get(f'{settings.FIGMA_API_URL}{endpoint}', headers={'Authorization': f'Bearer {token}'})
    if response.status_code != 200:
        if 'err' in response.json():
            return {
                'status': response.status_code,
                'error': response.json()['err']
            }
    return response.json()


def get_images(figma_url, token):
    return api_request(f'/images/{get_file_key(figma_url)}?ids={get_node_id(figma_url)}', token)


def get_files(figma_url, token):
    return api_request(f'/files/{get_file_key(figma_url)}/nodes?ids={get_node_id(figma_url)}', token)


def get_comments(figma_url, token):
    return api_request(f'/files/{get_file_key(figma_url)}/comments', token)


def get_frame_info(figma_url, token):
    comments = get_comments(figma_url, token)
    if 'error' in comments:
        return comments
    images = get_images(figma_url, token)
    if 'error' in images:
        return images
    files = get_files(figma_url, token)
    if 'error' in files:
        return files
    node_id = get_node_id(figma_url)
    return {
        'comments': comments['comments'],
        'image': images['images'][node_id],
        'files': files['nodes'][node_id]['document']
    }
