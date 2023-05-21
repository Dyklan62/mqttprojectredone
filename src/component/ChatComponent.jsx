
import 'reactjs-popup/dist/index.css';
import { useState,useEffect } from 'react';
import { useAppContext } from "../AppContext.jsx"

const usernameRegex = /username:(\w+)/;
const messageRegex = /message:([^]+?)(?=\username:|$)/;

const ChatComponent = ({currentTopic,username}) => {
  const { client, setClient } = useAppContext();
  const [messages, setMessages] = useState([])
  const [topicIsVisible, setTopicIsVisible] = useState(false);
    
  const sendMessage = (topic,message) => {
    client.publish(`${topic}`, `${message}`);
  };

  const handleTopicClick = () => {
    setTopicIsVisible(!topicIsVisible);
  }

  const extractMessage = (message) => {
    let usernameFromOther;
    let messageFromOther;
    const messageToString = message.toString();

    let match = messageToString.match(usernameRegex);
    if (match) {
      usernameFromOther = match[1];
      console.log("username:"+usernameFromOther);
    }
    match = messageToString.match(messageRegex);
    if (match) {
      messageFromOther = match[1];
      console.log("message:"+messageFromOther);
    }

    return { usernameFromOther, messageFromOther };
  };

  const handleMessages = (topic,message) => {
      if(currentTopic === topic) {
          const {usernameFromOther, messageFromOther, } = extractMessage(message);
          console.log(usernameFromOther+" "+messageFromOther);
          const messagetoTopic = { topic: topic, message: messageFromOther, username: usernameFromOther };
          setMessages(messages => [...messages, messagetoTopic]);
      }
  };

  const handleInputMessage = (e) => {
      e.preventDefault();
      const message = `topic:${currentTopic} message:${e.target.message.value} username:${username}`
      sendMessage(`${currentTopic}`,`${message}`);
  };

  useEffect(() => {
      client.on('message', handleMessages);
      return () => {
        client.off('message', handleMessages);
      };
  }, []);

    return (
        <>
        {!topicIsVisible ? (
        <button onClick={() => handleTopicClick()} type="button" className="leading-tight shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          +
        </button>
        ) : (
          <button  onClick={() => handleTopicClick()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
          </button>
        )}
        {
          topicIsVisible && (
            <>
            <div className='flex flex-col h-full overflow-x-auto mb-4' >
              {messages?.map((message, index) => {
                  const groupMessageClass = message.username === username ? 'col-start-6 col-end-10 p-2 rounded-lg' : 'col-start-1 col-end-5 p-3 rounded-lg p-2';
                  const messageClass = message.username === username ? 'flex items-center justify-center rounded-full bg-blue-500 flex-shrink-2 p-2' : 'flex items-center justify-center rounded-full bg-red-500 flex-shrink-2 p-2';
                  return (
                    <div key={index}>
                      <div className="flex flex-col h-full overflow-x-auto mb-4">
                        <div className="flex flex-col h-full">
                          <div className="grid grid-cols-10">
                            <div className={groupMessageClass}>
                              <div className="flex flex-row items-center">
                                {message.username.includes(username) ? (
                                  <>
                                  <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>{message.message}</div>
                                  </div>
                                  <div className={messageClass}>
                                    {username}
                                  </div>
                                </>
                                ) : (
                                  <>
                                  <div className={messageClass}>
                                    {message.username}
                                  </div>
                                  <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>{message.message}</div>
                                  </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
              </div>
              <form onSubmit={handleInputMessage} className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <input type="text" name="message" required="required" placeholder="message" className='leading-tight shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                </div>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <input type="submit" className='leading-tight shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'/>
                </div>
              </form>
            </>
          )
        } 
        </>

    )
}

export default ChatComponent