
import { useState } from 'react';
import { useAppContext } from "../AppContext.jsx"
import ChatComponent from '../component/ChatComponent.jsx'


export const Chat = ({username}) => {
  const { client, setClient } = useAppContext();
  const [topics, setTopics] = useState(['Main']);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ currentTopic, setCurrentTopic ] = useState('Main');

  const sendMessage = (topic,message) => {
    client.publish(`${topic}`, `${message}`);
  };


  const handleLeaveTopic = (t) => {
    console.log(t.target.value);
    sendMessage(`${t.target.value}`, `username:${username} message: a pris la porte`)
    client.unsubscribe(`${t.target.value}`);
    setTopics(topics.filter(topic => topic !== t.target.value));
  }

  const handleAddTopic = (e) => {
    e.preventDefault();
    const topic = e.target.topic.value;
    setTopics(topics => [...topics, topic]);
    client.subscribe(`${topic}`, { qos: 0 });
    setIsModalOpen(false);
  }

  const handleClickModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className='Chatdiv w-full'>
      <p className="mb-4 font-extrabold text-gray-900 underline underline-offset-8">vous etes connecté en tant que: <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{username}</span></p>
        <div>
        {topics.map((topic,index) => {
            return (
              <div key={index} className='topicdiv'>
                <span className="mb-4 font-extrabold text-gray-900 underline underline-offset-8">Canal: <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{topic}</span></span>
                <button className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight bg-orange-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"onClick={handleLeaveTopic} value={topic}>Quitter le canal</button>
                <ChatComponent currentTopic={topic} username={username}/>
              </div>
            )})
        }
        </div>
        {!isModalOpen ? (
        <button className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded" onClick={() => {handleClickModal()}}>+ ajouter un canal</button>
        ) : (
          <>
            <button  onClick={() => handleClickModal()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
            </button>
            <form onSubmit={handleAddTopic} className='flex flex-wrap -mx-3 mb-6'>
              <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <input type="text" name="topic"  required="required" placeholder="nom du canal" className='leading-tight shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                  </div>
                  <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <input type="submit" value="ajouter le canal" className='leading-tight shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'/>
                  </div>
            </form> 
          </>

          )}
    </div>
  );
};
