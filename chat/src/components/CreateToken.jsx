import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';


const CreateToken = () => {
  const navigate = useNavigate();
    const handleGenerated=()=>{
      navigate("/GeneratedToken")
    }

  // State to hold the token form data
  const [tokenData, setTokenData] = useState({
    Participant: '',
  });

  const [isLoading, setIsLoading] = useState(false);
     
  // Handle input changes
  const handleChange = (e) => {
    setTokenData(prevData => ({
      ...prevData,
    }));
  };

  // Handle form submission (placeholder)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real application, you would send tokenData to a backend API or blockchain smart contract here.
    console.log('Token Data Submitted:', tokenData);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Token creation initiated!`);
      // Optionally reset form: setTokenData({ name: '', symbol: '', supply: '', description: '' });
    }, 100);
  };

  return (
    <div className='flex justify-center p-8 bg-gray-50 min-h-screen'>
      <div className='w-full max-w-2xl bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100'>
        
        {/* Header */}
        <h1 className='text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
          Create Token
        </h1>
        <p className='text-gray-500 mb-8'>
          Define the core properties of your new digital asset or update an existing one.
        </p>

        {/* Token Creation Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Description */}
          <div>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>Participant</label>
            <textarea
              id='description'
              name='description'
              onChange={handleChange}
              rows='4'
              placeholder='No.of participant'
              className='w-full  border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm resize-none'
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            onClick={handleGenerated}
            disabled={isLoading}
            className='w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center space-x-2'
          >
            {isLoading ? (
              <>
                {/* Simple loading spinner */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Genearate Token'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateToken;