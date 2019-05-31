from django.urls import path

from chicken import views

urlpatterns = [
    path('', views.v1.oauth.oauth, name='v1-oauth'),
    path('/callback', views.v1.oauth.oauth_callback, name='v1-oauth_callback'),
]
