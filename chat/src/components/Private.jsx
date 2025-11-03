import React, { useState, useEffect } from 'react';

// *** ⚠️ IMPORTANT: DEFINE YOUR API PATHS HERE ⚠️ ***
// Use environment variables (e.g., process.env.REACT_APP_API_URL) 
// in a real application, but for now, we'll use placeholder strings.
const API_BASE_URL = 'http://localhost:3000/api/v1'; 
const FETCH_ROOM_ENDPOINT = `${API_BASE_URL}/private-room/get-room-by-user`; // e.g., returns { roomName: "..." }
const VALIDATE_TOKEN_ENDPOINT = `${API_BASE_URL}/private-room/validate-token`; // e.g., takes { roomName, token }

const Private = () => {
    // State definitions remain the same
    const [roomName, setRoomName] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // **********************************************
    // 1. API CALL to Fetch the Room Name
    // **********************************************
    const fetchRoomName = async () => {
        setError('');
        setIsLoading(true);
        try {
            // NOTE: You might need to include headers here for authentication (e.g., Authorization: Bearer token)
            const response = await fetch(FETCH_ROOM_ENDPOINT, {
                method: 'GET', // Or 'POST' if your API requires a body
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${userAuthToken}` // <-- Add user authentication token here
                },
                // Include user ID or unique identifier in the body or URL if needed
            });

            if (!response.ok) {
                // Handle HTTP errors (404, 500, etc.)
                throw new Error(`Failed to fetch room details: ${response.statusText}`);
            }

            const data = await response.json();
            
            // ⚠️ ADJUST 'data.roomName' to match the actual key in your API response ⚠️
            const fetchedName = data.roomName || 'Default Private Room'; 

            setRoomName(fetchedName);
        } catch (err) {
            console.error("Error fetching room name:", err);
            setError(`Error: ${err.message}`);
            setRoomName(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Run the fetch function once when the component mounts
    useEffect(() => {
        fetchRoomName();
    }, []); 

    // **********************************************
    // 2. API CALL to Validate the Token
    // **********************************************
    const handleEnterRoom = async () => {
        setError('');
        if (!token.trim()) {
            setError("Please enter a valid token to proceed.");
            return;
        }

        setIsLoading(true); // Set loading while validating token
        
        try {
            const response = await fetch(VALIDATE_TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    roomName: roomName, // Send the room name
                    token: token        // Send the user-entered token
                    // Optionally, send user ID or session data
                }),
            });

            if (response.status === 200) {
                // Success! Token is valid
                console.log("Token validated successfully. Navigating to room...");
                
                // *** 🔑 SUCCESS ACTION: Redirect user or update state to enter the room 🔑 ***
                // Example: navigate('/private/' + roomName); 
            } else if (response.status === 401) {
                 // Common status for unauthorized/invalid credentials
                setError("Invalid token. Please check and try again.");
            } else {
                throw new Error(`Room access failed: ${response.statusText}`);
            }

        } catch (err) {
            console.error("Error validating token:", err);
            setError(`Access attempt failed: ${err.message}`);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };
    
    // The JSX (rendering) part remains the same, but with the new isLoading state being managed
    return (
        <div className='private-section-container'>
            <h2>Private Room Access 🤫</h2>

            {isLoading && <p>Loading...</p>}
            
            {error && <p className='error-message' style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            {!isLoading && roomName && (
                <>
                    <p>You are requesting access to: 
                       <br/> 
                       <strong>{roomName}</strong>
                    </p>

                    <div className='token-input-area'>
                        <label htmlFor='token-input'>Token required:</label>
                        <input
                            id='token-input'
                            type='password'
                            placeholder='Enter your private token'
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            // Handles the 'Enter' key press
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && token.trim()) { // Only try to enter if a token is present
                                    handleEnterRoom();
                                }
                            }}
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleEnterRoom}
                            disabled={!token.trim() || isLoading} // Disable button if token is empty or loading
                        >
                            Enter Room
                        </button>
                    </div>
                </>
            )}

            {!isLoading && !roomName && !error && (
                 <p>No private room found for your account, or the room name could not be loaded.</p>
            )}
        </div>
    );
}

export default Private;