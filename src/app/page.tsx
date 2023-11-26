// pages/index.tsx

"use client";
import Head from 'next/head'
import '@aws-amplify/ui-react/styles.css';
import { Message, MessageColorTheme } from '@aws-amplify/ui-react';
import { useState, ChangeEvent, FormEvent } from 'react';

interface Result {
  status: string;
  message: string;
}

export default function Home() {
  const [useUserKey, setUseUserKey] = useState<boolean>(false);
  const [targetName, setTargetName] = useState<string>('Not Specified');
  const [link, setLink] = useState<string>('');
  const [boxDisplay, setBoxDisplay] = useState<boolean>(false);
  const [resultStatus, setResultStatus] = useState<string>('');
  const [resultHeading, setResultHeading] = useState<string>('');
  const [resultTheme, setResultTheme] = useState<MessageColorTheme>('error');
  const [loading, setLoading] = useState<boolean>(false);

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      targetName: targetName,
      targetUrl: link,
    };

    try {
      const response = await fetch(`/api/urlcreate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: Result = await response.json();
        console.log(result);

        if (result.status === 'Failed') {
          setResultHeading('The User Key is Already Taken!');
          setResultStatus('Try to Change the User Key');
          setResultTheme('error');
        } else {
          setResultTheme('success');
          setResultHeading('Url Generated');
          setResultStatus(`https://cuturi.vercel.app/${result.message}`);
          setBoxDisplay(true);
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error Message');
    } finally {
      setLoading(false);
    }
  };

  const toggleUseUserKey = () => {
    if (useUserKey === false) {
      setTargetName('');
    }
    if (useUserKey === true) {
      setTargetName('Not Specified');
    }
    setUseUserKey(!useUserKey);
  };

  const handleTargetNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTargetName(e.target.value);
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <Head>
        <title>Cut URL</title>
      </Head>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="mb-5">URL SHORTENER</h1>
        <label className="block mb-4">
          Link:
          <input
            type="link"
            className="w-full border border-gray-400 p-2 rounded mt-1"
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
          <span className={`text-sm ${useUserKey ? 'text-blue-500' : 'text-gray-500'}`}>
            {useUserKey ? 'On' : 'Off'}
          </span>
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

        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded mb-5 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-900 mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit'
          )}
        </button>

        {resultTheme === 'error' && boxDisplay ? (
          <Message variation="filled" colorTheme="error" heading={resultHeading}>
            {resultStatus}
          </Message>
        ) : null}
        {resultTheme === 'success' && boxDisplay ? (
          <Message variation="filled" colorTheme="success" heading={resultHeading}>
            <a href={resultStatus} target="_blank" rel="noopener noreferrer">
              {resultStatus}
            </a>
          </Message>
        ) : null}
      </div>
    </div>
  );
}
