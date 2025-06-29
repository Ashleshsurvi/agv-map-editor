from django.test import TestCase
from rest_framework.test import APIClient
from .models import Node

class NodeAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create one test node
        self.node = Node.objects.create(
            code=999,
            x=100,
            y=100,
            directions=["North"],
            name="Test Node"
        )

    def test_list_nodes(self):
        response = self.client.get('/api/NodeList/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["code"], 999)

    def test_create_node(self):
        payload = {
            "code": 123,
            "x": 500,
            "y": 500,
            "directions": ["East"],
            "name": "Created Node"
        }
        response = self.client.post('/api/NodeList/', payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Node.objects.filter(code=123).exists())

    def test_update_node(self):
        payload = {
            "code": self.node.code,
            "x": 999,
            "y": 999,
            "directions": ["South"],
            "name": "Updated Node"
        }
        url = f"/api/NodeUpdate/{self.node.id}/"
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, 200)

        updated_node = Node.objects.get(id=self.node.id)
        self.assertEqual(updated_node.x, 999)
        self.assertEqual(updated_node.y, 999)
        self.assertEqual(updated_node.directions, ["South"])
