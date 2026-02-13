from django.urls import path

from .views import GameConfigView, HealthView, ValidateWordView

urlpatterns = [
    path('health/', HealthView.as_view(), name='health'),
    path('config/', GameConfigView.as_view(), name='config'),
    path('validate-word/', ValidateWordView.as_view(), name='validate-word'),
]
