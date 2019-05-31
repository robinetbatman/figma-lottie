from chicken.tests.test_helpers.route_test_case import RouteTestCase


class V1RoutesTestCase(RouteTestCase):

    def test_api_routes(self):
        self.check_route('/v1/form', 'v1-form', 'form')
        self.check_route('/v1/lottie', 'v1-lottie', 'lottie')
        self.check_route('/v1/preview/abc', 'v1-preview', 'preview', kw_params={'url': 'abc'})

    def test_oauth_routes(self):
        self.check_route('/v1/oauth', 'v1-oauth', 'oauth')
        self.check_route('/v1/oauth/callback', 'v1-oauth_callback', 'oauth_callback')
