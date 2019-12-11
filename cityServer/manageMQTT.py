import paho.mqtt.client as mqttLib

def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  client.subscribe("topic/ping")

def on_message(client, userdata, msg):
  if msg.payload.decode() == "Ping!":
      client.publish("topic/ping", "Pong!")
    
client = mqttLib.Client()
client.connect("localhost",1883,60)
client.on_connect = on_connect
client.on_message = on_message
