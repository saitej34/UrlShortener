"use client"
import { useState } from 'react';
import { redirect } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import generateHash from '../../../usable-functions/findHash';
import axios from "axios";
import crypto from "crypto";

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifyButtonActive, setIsVerifyButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('/api/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);

        if (response.status === 'Success') {
          toast.success('OTP Sent to mail ID');
          setIsVerifyButtonActive(true);
        } else {
          toast.error('Internal Server Error!! Try Reloading...');
        }
      });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('/api/document/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);

        if (response.status === 'Success') {
          const hash = crypto.createHash('sha256');
          hash.update(email);
          let hashValue = hash.digest('hex')
          let url = `/api/document/auth?hashValue=${hashValue}&email=${email}`
          const result = axios.get(url);
          toast.success('OTP Verification Successful !!');
          toast.success('Soon you will be receiving an email Cnfirmation from us!!')
          setTimeout(()=>{},2000)
        } else {
          if (response.message === 'OTP Expired Start the Process from start') {
            toast.error('OTP Expired!!');

          } else if (response.message === 'Wrong OTP Entered') {
            toast.error('Wrong OTP Entered');
          } else {
            toast.error('OTP Verification Failed');
          }
        }
      });
  };

  const isOtpValid = /^\d{6}$/.test(otp);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div>
        <Toaster />
      </div>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Email Auth</h1>
        {!isVerifyButtonActive ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded-md transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Submit'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-600">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="6 Digit Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded-md transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300 ${
                isOtpValid ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!isOtpValid || isLoading}
            >
              {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailAuth;
