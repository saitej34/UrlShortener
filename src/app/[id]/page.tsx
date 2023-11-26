"use client";

// Import the necessary modules
import Head from 'next/head'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from "axios";
import { useRouter } from 'next/navigation'

const DynamicRoute = async() => {
  const [message,setmessage] = useState('');
  const [status,setstatus] = useState("We're redirecting you to your site...");
  const router  = useRouter();
  const pathname = usePathname();
  let id : string = (pathname.substring(1))
  useEffect(()=>{
    fetch(`/api/getdata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"key":id}),
    }).then((response) => response.json()).then((response)=>{
      if(response.status == "Failed")
      {
          setstatus("No Redirection Found");
          alert("No Redirection Found");
          setTimeout(()=>{
            redirect("https://cuturi.vercel.app");
          },5000)
      }
        if(response.status == "Success")
        {
            router.push(response.message)
            setmessage(response.message);
        }
    })
  },[id])
    
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Head>
        <title>Redirecting...</title>
      </Head>
    <div className="text-center">
      <h1 className="text-4xl mb-8">Just a moment...</h1>
      <div className="slider relative">
        <div className="line h-2 w-24 bg-blue-500 absolute top-1/2 transform -translate-y-1/2"></div>
        <div className="break dot1 bg-blue-500"></div>
        <div className="break dot2 bg-blue-500"></div>
        <div className="break dot3 bg-blue-500"></div>
      </div>
      <br/>
      <p className="mt-8">
      {status}
      {message ? <a href={message} className="text-blue-500 hover:underline">
          Click here.
        </a> : null}
      </p>
    </div>
  </div>
  );
};

export default DynamicRoute;
