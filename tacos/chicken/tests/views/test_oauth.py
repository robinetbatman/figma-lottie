from uuid import uuid4

import django
from django.core.cache import cache
from django.test import TestCase, SimpleTestCase
from django.urls import reverse


class OauthIntegrationTestCase(SimpleTestCase):

    def test_oauth(self):
        c = django.test.Client()

        old_state = str(uuid4())
        cache.set('state', old_state)
        response = c.get(reverse('v1-oauth'))
        assert response.status_code == 302
        assert cache.get('state') != old_state
