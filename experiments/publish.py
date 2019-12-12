#!/usr/bin/env python3

import paho.mqtt.client as mqtt

# This is the Publisher

client = mqtt.Client()
client.connect("localhost", 1883,60)
client.publish("topic/ping", "Ping!")
client.disconnect()