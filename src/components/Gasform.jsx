'use client'
import React, { useState } from 'react';

const GasForm = () => {
  const [dateRefilled, setDateRefilled] = useState('');
  const [gasSize, setGasSize ] = useState ('');
  const [userEmail, setUserEmail] = useState ('');

  const handleDateChange = (event) => {
    setDateRefilled(event.target.value);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleSizeChange = (event) => {
    setGasSize(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/gas/checkExpiration', {
      method: 'POST',
      body: JSON.stringify({ dateRefilled }),
    });

    const data = await response.json();
    // Handle the data and email notification here
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-300">
      <div className="w-full md:w-1/2 h-1/2 md:h-screen flex justify-center items-center bg-gray-800">
        <div className="w-4/5 md:w-3/5 lg:w-2/2 p-8">
          <h1 className="text-xl font-bold mb-4"> Refill Notification System</h1>
          <select className='text-black py-2 mb-2 rounded' value={gasSize} onChange={handleSizeChange}>
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
          onChange={handleEmailChange} />
          <div className='text-center justify-center'>
          <button
            className="rounded-lg px-2 py-2 bg-white text-black w-full md:w-40"
            onClick={handleSubmit}
          >
            Submit
          </button>
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3 h-1/2 md:h-screen flex justify-center items-center">
        <img
          src="https://img.freepik.com/free-photo/3d-rendering-gas-cylinder_23-2149290449.jpg?size=626&ext=jpg&ga=GA1.1.149556823.1683788678&semt=ais"
          alt="challenge"
          className="h-1/2 md:h-full"
        />
      </div>
    </div>
  );
};

export default GasForm;
