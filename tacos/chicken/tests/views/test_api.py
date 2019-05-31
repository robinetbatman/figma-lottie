from uuid import uuid4

import django
from django.core.cache import cache
from django.test import TestCase, SimpleTestCase
from django.test.client import MULTIPART_CONTENT
from django.urls import reverse

from chicken.utils.views.api import get_config_df
from tacos import settings


class ApiIntegrationTestCase(SimpleTestCase):

    def setUp(self):
        self.access_token = settings.TEST_ACCESS_TOKEN
        self.refresh_token = settings.TEST_REFRESH_TOKEN
        self.figma_url = settings.TEST_FIGMA_URL
        self.uuid = str(uuid4())

    def test_form_required_figma_url(self):
        c = django.test.Client()

        response = c.get(f"{reverse('v1-form')}?uuid={str(uuid4())}")
        assert response.status_code == 400

    def test_form_required_uuid(self):
        c = django.test.Client()

        response = c.get(f"{reverse('v1-form')}?figma_url={str(uuid4())}")
        assert response.status_code == 400

    def test_form_unknown_uuid(self):
        c = django.test.Client()

        response = c.get(f"{reverse('v1-form')}?figma_url={str(uuid4())}&uuid={str(uuid4())}")
        assert response.status_code == 403

    def test_form_wrong_credentials(self):
        c = django.test.Client()

        # Set random values for credentials
        cache.set(f'{self.uuid}_access_token', str(uuid4()))
        cache.set(f'{self.uuid}_refresh_token', str(uuid4()))

        response = c.get(f"{reverse('v1-form')}?figma_url={str(uuid4())}&uuid={self.uuid}")
        assert response.status_code == 403

    def test_form_wrong_figma_url(self):
        c = django.test.Client()

        # Set working values for credentials
        cache.set(f'{self.uuid}_access_token', self.access_token)
        cache.set(f'{self.uuid}_refresh_token', self.refresh_token)

        response = c.get(f"{reverse('v1-form')}?figma_url={str(uuid4())}&uuid={self.uuid}")
        assert response.status_code == 404

    def test_form_working(self):
        c = django.test.Client()

        # Set working values for credentials
        cache.set(f'{self.uuid}_access_token', self.access_token)
        cache.set(f'{self.uuid}_refresh_token', self.refresh_token)

        response = c.get(f"{reverse('v1-form')}?figma_url={self.figma_url}&uuid={self.uuid}")
        assert response.status_code == 200
        data = response.json()
        assert 'url' in data
        df = get_config_df()
        assert data['url'] in df.index

    def test_lottie_required_url(self):
        c = django.test.Client()

        response = c.post(f"{reverse('v1-lottie')}?uuid={self.uuid}", None, content_type=MULTIPART_CONTENT)
        assert response.status_code == 400

    def test_lottie_unknown_url(self):
        c = django.test.Client()

        response = c.post(f"{reverse('v1-lottie')}?uuid={self.uuid}&url={str(uuid4())}", None, content_type=MULTIPART_CONTENT)
        assert response.status_code == 400

    def test_lottie_working(self):
        c = django.test.Client()

        # Set working values for credentials
        cache.set(f'{self.uuid}_access_token', self.access_token)
        cache.set(f'{self.uuid}_refresh_token', self.refresh_token)

        response = c.get(f"{reverse('v1-form')}?figma_url={self.figma_url}&uuid={self.uuid}")
        url = response.json()['url']

        response = c.post(f"{reverse('v1-lottie')}?uuid={self.uuid}&url={url}", None, content_type=MULTIPART_CONTENT)
        assert response.status_code == 204

    def test_preview_unknown_url(self):
        c = django.test.Client()

        response = c.get(reverse('v1-preview', kwargs={'url': str(uuid4())}))
        assert response.status_code == 404

    def test_preview_working(self):
        c = django.test.Client()

        # Set working values for credentials
        cache.set(f'{self.uuid}_access_token', self.access_token)
        cache.set(f'{self.uuid}_refresh_token', self.refresh_token)

        response = c.get(f"{reverse('v1-form')}?figma_url={self.figma_url}&uuid={self.uuid}")
        url = response.json()['url']

        c.post(f"{reverse('v1-lottie')}?uuid={self.uuid}&url={url}", None, content_type=MULTIPART_CONTENT)

        response = c.get(reverse('v1-preview', kwargs={'url': url}))
        assert response.status_code == 200
