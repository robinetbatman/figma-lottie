from django.urls import path

from chicken import views

urlpatterns = [
    path('form', views.v1.api.form, name='v1-form'),
    path('lottie', views.v1.api.lottie, name='v1-lottie'),
    path('preview/<str:url>', views.v1.api.preview, name='v1-preview'),
]
