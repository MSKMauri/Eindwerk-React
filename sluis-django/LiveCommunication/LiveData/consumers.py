from channels.consumer import AsyncConsumer, SyncConsumer
from channels.exceptions import StopConsumer
import json
import asyncio
import random

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
        # Start sending water level data
        asyncio.create_task(self.send_water_levels())

    async def send_water_levels(self):
        while True:
            # Simuleer waterniveaus (later te vervangen door echte sensordata)
            base = random.randint(3, 8)
            variation = random.randint(-1, 1)
            
            water_levels = {
                "Sensor1": base,
                "Sensor2": base + variation,
                "Sensor3": base - variation,
                "timestamp": "2024-06-01T12:00:00"  # Later te vervangen door echte timestamp
            }
            
            await self.send({
                'type': 'websocket.send',
                'text': json.dumps(water_levels)
            })
            await asyncio.sleep(1)  # Update elke seconde

    async def websocket_receive(self, event):
        print('Message received from client', event)
        # Hier kun je eventueel een antwoord sturen met await self.send(...)

    async def websocket_disconnect(self, event):
        print("Websocket disconnected", event)
        # Hier kun je cleanup doen indien nodig