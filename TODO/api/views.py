from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import *

# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    api_urls={ 
        'List': '/task_list/' ,
        'Detail View': '/task_detail/<str:pk>/',
        'Create': '/task_create/',
        'Update': '/task_update/<str:pk>/',
        'Delete': '/task_delete/<str:pk>',
        }
    
    return Response(api_urls)
@api_view(['GET'])
def tasklist(request):

    task=Task.objects.all().order_by("-id")
    serializer=TaskSerializer(task, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, pk):
    task=Task.objects.get(id=pk)
    serializer=TaskSerializer(task, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def taskCreate(request):

    serializer=TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)

@api_view(['POST'])
def taskUpdate(request, pk):
    task=Task.objects.get(id=pk)
    serialilzer= TaskSerializer(instance=task, data=request.data)

    if serialilzer.is_valid():
        serialilzer.save()
    
    return Response(serialilzer.data)

@api_view(['DELETE'])
def taskDelete(request, pk):
    task=Task.objects.get(id=pk)
    task.delete()
    
    return Response("Item deleted Successfully")

