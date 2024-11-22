from django.urls import path
from . import views

urlpatterns = [
    path('miners/', views.asic_data, name='asic_data'),
]
