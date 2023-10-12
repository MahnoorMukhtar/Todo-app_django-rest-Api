"""
URL configuration for TODO project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import *
from django.views.generic import TemplateView

urlpatterns = [

    #Api urls       
    path('api/', apiOverview, name="api_Overview"),
    path('task_list/',tasklist, name="task_list"),
    path('task_detail/<str:pk>/', taskDetail, name="task_detail"),
    path('task_create/', taskCreate, name="task_create"),
    path('task_update/<str:pk>/', taskUpdate, name="task_update"),
    path('task_delete/<str:pk>/', taskDelete, name="task_delete"),
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name= "index.html")),


    #Frontend urls
    path('', list, name="list")
]
