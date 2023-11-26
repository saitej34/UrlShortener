"use client";

import '@aws-amplify/ui-react/styles.css';
import { Message } from '@aws-amplify/ui-react';
import Image from 'next/image'
import { useState } from 'react';

export default function Home() {
  const [useUserKey, setUseUserKey] = useState(false);
  const [targetName, setTargetName] = useState('Not Specified');
  const [link, setLink] = useState('');
  const [boxDisplay,setBoxDisplay] = useState(false);
  const [resultStatus,setResultStatus] = useState('');
  const [resultHeading,setResultHeading] = useState('');
  const [resultTheme,setResultTheme] = useState('');

  const submitHandler = async(e : any) => {
    e.preventDefault();
    const data = {
      targetName:targetName,
      targetUrl:link
    }
    console.log(data)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTURL}/api/urlcreate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if(result.status === "Failed")
        {
           setResultHeading("The User Key is Already Taken!");
           setResultStatus("Try to Change the User Key");
           setResultTheme("error");
        }
        else 
        {
          setResultTheme("success");
          setResultHeading("Url Generated");
          setResultStatus(`http://localhost:3000/${result.message}`);
          setBoxDisplay(true);
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error("Error Message");
    }

  }

  const toggleUseUserKey = () => {
    if(useUserKey==false)
    {
      setTargetName('');
    }
    if(useUserKey==true)
    {
      setTargetName('Not Specified');
    }
    setUseUserKey(!useUserKey);
  };

  const handleTargetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetName(e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-96">
      <h1 className='mb-5'>URL SHORTENER</h1>
        <label className="block mb-4">
          Link:
          <input
            type="link"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            placeholder="Enter your link"
            value={link}
            onChange={handleLinkChange}
          />
        </label>

        <div className="flex items-center mb-4">
          <label className="mr-4">Use User Key:</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              checked={useUserKey}
              onChange={toggleUseUserKey}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer opacity-0"
            />
            <label
              htmlFor="toggle"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                useUserKey ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            ></label>
          </div>
          <span className={`text-sm ${useUserKey ? 'text-blue-500' : 'text-gray-500'}`}>{useUserKey ? 'On' : 'Off'}</span>
        </div>

        {useUserKey && (
          <label className="block mb-4">
            Target Name:
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded mt-1"
              placeholder="Enter target name"
              value={targetName}
              onChange={handleTargetNameChange}
            />
          </label>
        )}

        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-5" onClick={submitHandler}>
          Submit
        </button>
        {resultTheme==="error" && boxDisplay ? <Message
                                variation="filled"
                                colorTheme="error"
                                heading={resultHeading}>
                                {resultStatus}
                              </Message> : null}
        {resultTheme==="success" && boxDisplay ? <Message
                                variation="filled"
                                colorTheme="success"
                                heading={resultHeading}>
                                <a href={resultStatus} target="_blank">{resultStatus}</a>
                              </Message> : null}
                    
      </div>
    </div>
  );
}
