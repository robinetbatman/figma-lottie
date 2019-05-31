from django.test import SimpleTestCase
from django.urls import resolve
from django.urls import reverse


class RouteTestCase(SimpleTestCase):
    def check_route(self, path, pattern_name, func_name, kw_params=None):
        if kw_params is not None:
            url_one = reverse(pattern_name, kwargs=kw_params)
        else:
            url_one = reverse(pattern_name)

        full_path = '/chicken' + path
        self.assertEqual(full_path, url_one)

        resolver = resolve(full_path)
        self.assertEqual(resolver.url_name, pattern_name)
        self.assertEqual(resolver.view_name, pattern_name)
        self.assertEqual(resolver.func.__name__, func_name)
