'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import postmark from 'postmark';


const supabaseUrl = 'https://epyjvrtstdfrakwvfauw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweWp2cnRzdGRmcmFrd3ZmYXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1ODYxMjYsImV4cCI6MjAxNDE2MjEyNn0.HSLxmjR4jzZIzg6fJ-PYTnVDnqUESyDOd7ffv_oK89E';
const supabase = createClient(supabaseUrl, supabaseKey);

const GasForm = () => {
  const [gasSize, setGasSize] = useState('');
  const [dateRefilled, setDateRefilled] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleGasSizeChange  = (event) => {
    setGasSize(event.target.value);
  };

  const handleDateChange = (event) => {
    setDateRefilled(event.target.value);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let expirationDate;
    if (gasSize === '12.5kg') {
      const refillDateObj = new Date(dateRefilled);
      expirationDate = new Date(refillDateObj.setDate(refillDateObj.getDate() + 60));
  
      try {
        const { data, error } = await supabase.from('gas').insert([
          { gasSize, refillDate: dateRefilled, userEmail, expirationDate },
        ]);
  
        if (error) {
          console.error('Error inserting data: ', error);
        } else {
          console.log('Gas refill data inserted successfully: ', data);
          window.alert('Gas refill date is noted tracking...')
          
          const client = new postmark.ServerClient("fec86a33-f3e8-4d0a-ad9e-82839b48611f");
          const sendEmailResult = await client.sendEmail({
            From: 'official@careerhaven.ca',
            To: userEmail,
            Subject: 'Gas Refill Notification',
            TextBody: `Your ${gasSize} gas is reaching its threshold! Please consider a refill.`,
          });
  
          console.log('Email notification sent successfully:', sendEmailResult);
        }
      } catch (error) {
        console.error('Error inserting data: ', error.message);
      }
    }
  };
    

  useEffect(() => {
    if (gasSize === '5kg' || gasSize === '12.5kg') {
      const checkExpiration = async () => {
        const { data, error } = await supabase
          .from('gas')
          .select('expirationDate')
          .eq('gasSize', gasSize);
        if (error) {
          console.error('Error fetching data: ', error);
        } else if (data && data.length > 0) {
          const expirationDate = new Date(data[0].expirationDate);
          const currentDate = new Date();
          const timeDiff = expirationDate.getTime() - currentDate.getTime();
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          if ((gasSize === '5kg' && daysDiff <= 14) || (gasSize === '12.5kg' && daysDiff <= 56)) {
            alert(`Your ${gasSize} gas is reaching its threshold! Please consider a refill.`);
          }
        }
      };
      checkExpiration();
    }
  }, [gasSize]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-300">
      <div className="w-full md:w-1/2 h-1/2 md:h-screen flex justify-center items-center bg-gray-800">
        <div className="w-4/5 md:w-3/5 lg:w-2/2 p-8">
          <h1 className="text-xl font-bold mb-4"> Gas Refill Notification Alert</h1>
          <form onSubmit={handleSubmit}>
            <select className='text-black py-2 mb-2 rounded w-full' value={gasSize} onChange={handleGasSizeChange}>
              <option value="1kg">1kg</option>
              <option value="5kg">5kg</option>
              <option value="16kg">16kg</option>
              <option value="12.5kg">12.5kg</option>
            </select>
            <input
              className="text-black w-full p-2 mb-4 rounded"
              type="date"
              value={dateRefilled}
              onChange={handleDateChange}
            />
            <input
              className='text-black w-full p-2 mb-4 rounded'
              type="email"
              placeholder='Email'
              value={userEmail}
              onChange={handleEmailChange}
            />
            <div className='text-center justify-center'>
              <button
                className="rounded-lg px-2 py-2 bg-white text-black w-full md:w-40"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>

        </div>
      </div>
      <div className="w-full md:w-3/3 h-1/2 md:h-screen flex justify-center items-center">
        <Image
          src='/assets/hf.png'
          width={1200}
          height={800}
          className='h-1/2 md:h-full'
        />
      </div>
    </div>
  );
};

export default GasForm;
