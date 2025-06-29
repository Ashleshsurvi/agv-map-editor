from django.db import models

class Node(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    code = models.IntegerField(unique=True)
    directions = models.JSONField(default=list)
    name = models.CharField(max_length=100, blank=True)
    charger = models.JSONField(null=True, blank=True)
    chute = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.name or f"Node {self.code}"
