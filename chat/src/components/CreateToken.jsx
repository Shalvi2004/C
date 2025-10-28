import React, { useState } from 'react';

// --- API Call Implementation (Your Backend Logic) ---
const callTokenGenerationAPI = async (participantCount) => {
  
    // ⚠️ MUST BE REPLACED: Use your actual API endpoint here
    const API_ENDPOINT = 'YOUR_ACTUAL_API_ENDPOINT_HERE'; 
    
    if (API_ENDPOINT === 'YOUR_ACTUAL_API_ENDPOINT_HERE') {
        // Throw an error if the user forgets to replace the placeholder
        throw new Error("API_ENDPOINT is not configured. Please set it to your actual backend URL.");
    }
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include 'Authorization' or other required headers
            },
            body: JSON.stringify({ 
                participantCount: participantCount 
            }),
        });

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ message: 'No error message provided.' }));
             throw new Error(errorData.message || `Server responded with status ${response.status}`);
        }

        // The backend must return the token in JSON format
        return response.json(); 

    } catch (error) {
        throw new Error(`Failed to connect to API: ${error.message}`);
    }
};

// --- React Component ---
const CreateToken = () => {
    const [participantCount, setParticipantCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedToken, setGeneratedToken] = useState(null);
    const [finalCount, setFinalCount] = useState(null);
    const [error, setError] = useState(null);
    const[isCopied, setIsCopied] = useState(false); 

    const handleChange = (e) => {
        const { value } = e.target;
        setError(null); 
        if (value === '' || /^\d+$/.test(value)) {
            setParticipantCount(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCopied(false); 

        const count = parseInt(participantCount);
        if (!count || count <= 0) {
            setError("Please enter a valid number of participants (greater than 0).");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 🔑 This line now calls your backend API directly.
            const response = await callTokenGenerationAPI(count);

            // Assuming your backend returns the token in a field named 'token'
            if (response.token) { 
                setGeneratedToken(response.token);
                setFinalCount(count);
                setParticipantCount(''); 
            } else {
                setError('Token generation succeeded, but the token was missing in the response. Check your backend payload.');
            }

        } catch (err) {
            setError(err.message || 'An unexpected error occurred during token generation.');
            console.error('Token Generation Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (generatedToken) {
            await navigator.clipboard.writeText(generatedToken);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };


    const renderContent = () => {
        if (generatedToken) {
            // Result View (Unchanged stylish UI)
            return (
                <div className='w-full flex flex-col items-center text-center'>
                    <h1 className='text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500'>
                        Success! 🎉
                    </h1>
                    
                    <p className='text-lg text-gray-600 mb-8'>
                        A unique token for **{finalCount}** participants has been created.
                    </p>

                    <h2 className='text-md font-medium text-gray-700 mb-3'>Your Access Token:</h2>
                    
                    <div className="w-full bg-teal-50 p-4 rounded-lg border border-teal-300 transition duration-300 hover:shadow-md cursor-pointer" onClick={handleCopy}>
                        <p className="text-xl md:text-2xl text-teal-800 font-mono tracking-wider break-all select-all">
                            {generatedToken}
                        </p>
                    </div>

                    <button 
                        onClick={handleCopy}
                        className={`mt-6 w-full py-3 font-semibold rounded-xl shadow-lg transition duration-300 transform active:scale-95 flex items-center justify-center space-x-2 
                            ${isCopied ? 'bg-green-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}
                        `}
                    >
                        {isCopied ? (
                            <>
                                <span className='text-xl'>✅</span> Copied!
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                </svg>
                                <span>Copy Token</span>
                            </>
                        )}
                    </button>

                </div>
            );
        } 

        // Form View (Unchanged stylish UI)
        return (
            <form onSubmit={handleSubmit} className='space-y-6 w-full'>
                <h1 className='text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'>
                    Token Factory 🏭
                </h1>
                <p className='text-lg text-gray-600 mb-8'>
                    Specify the number of participants to generate a unique, secured access token.
                </p>

                {/* Error Message Display */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-400 text-red-700 rounded-xl animate-pulse">
                        🛑 **Error:** {error}
                    </div>
                )}

                {/* Participant Count Input */}
                <div>
                    <label htmlFor='participantCount' className='block text-md font-semibold text-gray-700 mb-2'>Number of Participants</label>
                    <input
                        id='participantCount'
                        name='participantCount'
                        type='number'
                        value={participantCount}
                        onChange={handleChange}
                        placeholder='e.g., 50'
                        className='w-full p-4 border-2 border-gray-200 rounded-xl text-lg transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-sm'
                        min='1'
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isLoading || !participantCount}
                    className='w-full py-4 px-4 bg-indigo-600 text-white text-xl font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01] active:scale-95 disabled:bg-gray-400 disabled:shadow-md disabled:cursor-not-allowed flex justify-center items-center space-x-3'
                >
                    {isLoading ? (
                        <>
                            {/* Simple loading spinner */}
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating Token...</span>
                        </>
                    ) : (
                        <>
                            <span>Generate Token</span>
                            <span className='text-2xl ml-2'>→</span>
                        </>
                    )}
                </button>
            </form>
        );
    };

    return (
        <div className='flex justify-center p-8 bg-blue-50 min-h-screen items-center'>
            <div className='w-full max-w-lg bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-t-4 border-indigo-500 transform transition duration-500 hover:shadow-3xl'>
                {renderContent()}
            </div>
        </div>
    );
};

export default CreateToken;