from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Node

class NodeUpdate(APIView):
    def put(self, request, pk):
        try:
            node = Node.objects.get(pk=pk)
        except Node.DoesNotExist:
            return Response({"error": "Node not found."}, status=404)

        node.x = request.data.get("x", node.x)
        node.y = request.data.get("y", node.y)
        node.code = request.data.get("code", node.code)
        node.directions = request.data.get("directions", node.directions)
        node.name = request.data.get("name", node.name)
        node.charger = request.data.get("charger")
        node.chute = request.data.get("chute")
        node.save()
        return Response({"success": "Node updated."})

class NodeList(APIView):
    def get(self, request):
        nodes = Node.objects.all()
        data = [
            {
                'id': node.id,
                'x': node.x,
                'y': node.y,
                'code': node.code,
                'directions': node.directions,
                'name': node.name,
                'charger': node.charger,
                'chute': node.chute,
            }
            for node in nodes
        ]
        return Response(data)

    def post(self, request):
        data = request.data
        x = data.get('x')
        y = data.get('y')
        code = data.get('code')
        directions = data.get('directions', [])
        name = data.get('name', '')
        charger = data.get('charger', False)
        chute = data.get('chute', False)

        if x is not None and y is not None and code is not None:
            node = Node.objects.create(
                x=x,
                y=y,
                code=code,
                directions=directions,
                name=name,
                charger=charger,
                chute=chute
            )
            return Response({"message": f"Node {code} created."})
        else:
            return Response({"error": "x, y, and code are required."}, status=400)


class NodeBulkImport(APIView):
    def post(self, request):
        nodes_data = request.data
        if not isinstance(nodes_data, list):
            return Response({"error": "Expected a list of nodes."}, status=400)

        Node.objects.all().delete()
        created = 0

        for node_data in nodes_data:
            Node.objects.create(
                x=node_data.get('x'),
                y=node_data.get('y'),
                code=node_data.get('code'),
                directions=node_data.get('directions', []),
                name=node_data.get('name', ''),
                charger=bool(node_data.get('charger')),
                chute=bool(node_data.get('chute')),
            )
            created += 1

        return Response({"message": f"{created} nodes imported."})

class NodeDelete(APIView):
    def delete(self, request, code):
        try:
            node = Node.objects.get(code=code)
            node.delete()
            return Response({"message": f"Node {code} deleted."})
        except Node.DoesNotExist:
            return Response({"error": "Node not found."}, status=404)

class NodeClear(APIView):
    def delete(self, request):
        Node.objects.all().delete()
        return Response({"success": "All nodes deleted."})