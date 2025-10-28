import React, { useState } from 'react';

// --- API Call Simulation (REPLACE THIS WITH YOUR REAL BACKEND LOGIC) ---
const callTokenGenerationAPI = async (participantCount) => {
  
    const API_ENDPOINT = ''; 
    
    try {
        // Simulating the actual POST request and network delay
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include other headers like 'Authorization' if your API requires it
            },
            body: JSON.stringify({ 
                participantCount: participantCount 
            }),
        });

        // This block handles HTTP errors (4xx or 5xx)
        if (!response.ok) {
             // You can try to parse the error message from the backend response body
             const errorData = await response.json(); 
             throw new Error(errorData.message || `Server responded with status ${response.status}`);
        }

        // Return the parsed JSON response
        return response.json(); 

    } catch (error) {
        // Re-throw the error for the handleSubmit catch block to handle
        throw new Error(`Failed to connect to API: ${error.message}`);
    }
};

const CreateToken = () => {
    // ... (State declarations are unchanged)
    const [participantCount, setParticipantCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedToken, setGeneratedToken] = useState(null);
    const [finalCount, setFinalCount] = useState(null);
    const [error, setError] = useState(null);

    // ... (handleChange is unchanged)
    const handleChange = (e) => {
        const { value } = e.target;
        setError(null); 
        if (value === '' || /^\d+$/.test(value)) {
            setParticipantCount(value);
        }
    };

    // --- Handle Form Submission and API Call ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const count = parseInt(participantCount);
        if (!count || count <= 0) {
            setError("Please enter a valid number of participants (greater than 0).");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // ** This is the API call line **
            const response = await callTokenGenerationAPI(count);

            // ⚠️ If your API returns the token in a field other than 'token', 
            //    change 'response.token' below to match your backend's field name (e.g., response.key).
            if (response.token) { 
                setGeneratedToken(response.token);
                setFinalCount(count);
                setParticipantCount(''); 
            } else {
                 // Fallback for unexpected successful response structure
                setError('Token generation succeeded, but the token was missing in the response.');
            }

        } catch (err) {
            // Handle network errors and errors thrown from callTokenGenerationAPI
            setError(err.message || 'An unexpected error occurred during token generation.');
            console.error('Token Generation Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to reset the component back to the form (now included since it was commented out)
    const resetForm = () => {
        setGeneratedToken(null);
        setFinalCount(null);
        setError(null);
    };

    // Conditionally render the result or the form
    const renderContent = () => {
        if (generatedToken) {
            // Result View
            return (
                <div className='w-full flex flex-col items-center text-center'>
                    <h1 className='text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600'>
                        Token Generated! 🎉
                    </h1>
                    
                    <p className='text-gray-500 mb-6'>
                        For **{finalCount}** participants.
                    </p>

                    <h2 className='text-lg font-semibold text-gray-700 mb-2'>Your Unique Token:</h2>
                    
                    <div className="w-full bg-green-50 p-4 rounded-lg border-2 border-green-300">
                        <p className="text-2xl text-green-800 font-mono tracking-wider break-all">
                            {generatedToken}
                        </p>
                    </div>

                    <button 
                        onClick={() => navigator.clipboard.writeText(generatedToken)}
                        className="mt-6 w-full py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
                    >
                        Copy Token
                    </button>

                    <button 
                        onClick={resetForm}
                        className="mt-3 w-full py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        Generate Another Token
                    </button>
                </div>
            );
        } 

        // Form View
        return (
            <form onSubmit={handleSubmit} className='space-y-6 w-full'>
                <h1 className='text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
                    Create Token 🔗
                </h1>
                <p className='text-gray-500 mb-8'>
                    Enter the number of participants to generate a unique token for the event.
                </p>

                {/* Error Message Display */}
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Participant Count Input */}
                <div>
                    <label htmlFor='participantCount' className='block text-sm font-medium text-gray-700 mb-1'>Number of Participants</label>
                    <input
                        id='participantCount'
                        name='participantCount'
                        type='number'
                        value={participantCount}
                        onChange={handleChange}
                        placeholder='e.g., 50'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm'
                        min='1'
                    />
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isLoading || !participantCount}
                    className='w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center space-x-2'
                >
                    {isLoading ? (
                        <>
                            {/* Simple loading spinner */}
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Token...
                        </>
                    ) : (
                        'Generate Token'
                    )}
                </button>
            </form>
        );
    };

    // Main Component Return
    return (
        <div className='flex justify-center p-8 bg-gray-50 min-h-screen'>
            <div className='w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100'>
                {renderContent()}
            </div>
        </div>
    );
};

export default CreateToken;