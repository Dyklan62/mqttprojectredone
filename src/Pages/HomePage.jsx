import { useState } from 'react'
import '../App.css'
import {Chat} from './Chat'
import { useAppContext} from "../AppContext.jsx"
import mqtt from 'mqtt'


const HomePage = () => {
    const { client, setClient } = useAppContext();
    const [username, setUsername] = useState("");
    const [isconnected, setIsconnected] = useState(false);
    const [topic, setTopic] = useState("Main");
  
    const handleConnect = (e) => {
      e.preventDefault() ;
      const usernameFromForm = e.target.elements.username.value;
      console.log(usernameFromForm);
      const mqttClient = mqtt.connect('wss://a6d1639031f54423beaf0db4a3961767.s2.eu.hivemq.cloud:8884/mqtt', {
        username: 'Dflinois62',
        password: 'Dflinois62',
        clientId: usernameFromForm,
        protocolVersion: 4,
        connectTimeout: 4000,
        keepalive: 60,
        clean: true,
        reconnectPeriod: 1000,
        rejectUnauthorized: false,
        will: {
          topic: 'Main',
          payload: 'Connection Closed abnormally..!',
          qos: 0,
          retain: false
        },
        transformWsUrl: (url) => {
          return url;
        }
      });

      mqttClient.on('connect', () => {
        console.log('connected to MQTT broker');
        setClient(mqttClient);
        setUsername(usernameFromForm);
        setIsconnected(true);
        mqttClient.subscribe(`${topic}`, { qos: 1 });
      });

      
      mqttClient.on('error', e => {
        console.log('Error', e);
      });

      mqttClient.on('close', () => {
        mqttClient.end();
        setUsername('');
        setIsconnected(false);
      });
  };

  const handleDisconnect = () => {
    client.end();
    setUsername('');
    setIsconnected(false);
  };
  
return (
    <>
        {!isconnected ? (
            <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
              <form onSubmit={(e) => handleConnect(e)} >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Veuillez rentrer votre pseudo
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" required="required" placeholder="username" name="username"/>
                </div>
                <div className="flex items-center justify-between">
                  <button className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                    se connecter
                  </button>
                </div>
              </form>
            </div>
        ) : (
          <>
          <button  onClick={() => handleDisconnect()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
            se deconnecter
          </button>
            <Chat username={username}/>
          </>
        )}
    </>
    );
}

export default HomePage;    
