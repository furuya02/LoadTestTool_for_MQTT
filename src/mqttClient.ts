import * as path from 'path';

const awsIot = require('aws-iot-device-sdk');
export class MqttClient {

  private device;
  recvPayloads: string[] = [];

  constructor(keyPath: string, certPath: string, caPath: string, clientIdPrefix: string, iotEndpoint: string) {

    this.device = awsIot.device({
      keyPath: path.resolve(__dirname, keyPath),
      certPath: path.resolve(__dirname, certPath),
      caPath: path.resolve(__dirname, caPath),
      clientId: clientIdPrefix + Math.random().toString(32).substring(2),
      host: iotEndpoint
    });
  }

  publish(topic: string, payload: string) {
    this.device.publish(topic, payload);
  }
}
