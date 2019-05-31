from django.urls import include, path

urlpatterns = [
    path('', include('chicken.urls.v1.api')),
    path('oauth', include('chicken.urls.v1.oauth')),
]
