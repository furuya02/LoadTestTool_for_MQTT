
import { MqttClient } from './mqttClient';
import { progressMessage } from './progressMessage';

const clientIdPrefix = 'ClientId_';
const mqttClientMax = 1000;
const topic = 'iot/topic';
const iotEndpoint = 'xxxxxxxxxx-ats.iot.ap-northeast-1.amazonaws.com';
const certPath = './certs/certificate.pem.crt';
const keyPath = './certs/private.pem.key';
const caPath = './certs/root-CA.crt';
const schedule = [
   10000,
   10000,
   10000,
]

const payload = {
   "message": "hello"
}

const mqttClients: MqttClient[] = [];

let counter = 0;
function worker() {
   if (counter < schedule.length) {
      const rps = schedule[counter];
      var now = new Date();
      console.log(`[${counter}] ${now.toLocaleString()}.${now.getUTCMilliseconds()} rps:${rps} `);
      [...Array(rps).keys()].map(i => {
         mqttClients[i % (mqttClients.length)].publish(topic, JSON.stringify(payload));
      });
      counter += 1;
   }
}

async function main() {

   // MQTTクライアントの生成
   for (var i = 0; i < mqttClientMax; i++) {
      mqttClients.push(new MqttClient(keyPath, certPath, caPath, clientIdPrefix, iotEndpoint));
      await new Promise(resolve => setTimeout(resolve, 10));
      progressMessage(`MqttClient initializing. ${i + 1}/${mqttClientMax}`);
   }

   console.log(`\nPublish start`);

   const intervalId = setInterval(() => {
      worker();
   }, 1000);

   //  終了待機
   while (counter < schedule.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
   }
   await new Promise(resolve => setTimeout(resolve, 1000));

   clearInterval(intervalId);
   console.log("finish.");
   process.exit(1);
}

main();


