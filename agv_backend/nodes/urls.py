from django.urls import re_path
from .views import NodeList, NodeBulkImport, NodeUpdate, NodeDelete, NodeClear

urlpatterns = [
    re_path(r'^NodeList/$', NodeList.as_view()),
    re_path(r'^NodeBulkImport/$', NodeBulkImport.as_view()),
    re_path(r'^NodeClear/$', NodeClear.as_view()),
    re_path(r'^NodeUpdate/(?P<pk>\d+)/$', NodeUpdate.as_view()),   
    re_path(r'^NodeDelete/(?P<code>\d+)/$', NodeDelete.as_view()),   
]
