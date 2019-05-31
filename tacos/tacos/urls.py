from django.urls import include, path

urlpatterns = [
    path('chicken/', include('chicken.urls'), name="chicken"),
]
