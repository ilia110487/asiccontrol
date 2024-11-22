from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def asic_data(request):
    data = {
        "miners": [
            {"id": 1, "name": "Antminer L3+", "status": "Online", "hashrate": "504 MH/s"},
            {"id": 2, "name": "Antminer S19", "status": "Offline", "hashrate": "110 TH/s"}
        ]
    }
    return Response(data)

# Create your views here.
