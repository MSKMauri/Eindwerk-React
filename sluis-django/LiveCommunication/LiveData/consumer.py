from channels.consumer import AsyncConsumer, SyncConsumer
from channels.exceptions import StopConsumer
import json

# Synchrone WebSocket consumer
class MySyncConsumer(SyncConsumer):
    def websocket_connect(self, event):
        print("Websocket connected...", event)
        self.send({
            'type': 'websocket.accept'
        })

    def websocket_receive(self, event):
        print('Message received from client', event)
        self.send({
            'type': 'websocket.send',
            'text': "Hello"
        })

    def websocket_disconnect(self, event):
        print("Websocket disconnected", event)
        raise StopConsumer()

# Asynchrone WebSocket consumer
class MyAsyncConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print("Websocket connected...", event)
        await self.send({
            'type': 'websocket.accept'
        })

    async def websocket_receive(self, event):
        print('Message received from client', event)
        # Hier kun je eventueel een antwoord sturen met await self.send(...)

    async def websocket_disconnect(self, event):
        print("Websocket disconnected", event)
        # Hier kun je cleanup doen indien nodig