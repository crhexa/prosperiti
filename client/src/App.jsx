import './App.css';
import { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState('');
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/process-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: userInput }),
      });

      const data = await response.json();
      setServerResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setServerResponse('Error connecting to server');
    }
  };

  return (
    <div>
      <h1>Prosperiti</h1>
      <h2>AI Personal Planner Assistant</h2>
      <div className="card">
        <form id="user-search-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="user-input-entry" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} 
          />
          <button type="submit">Submit</button>
        </form>
        {serverResponse && <div>{serverResponse}</div>}
      </div>
    </div>
  );
}

export default App;
