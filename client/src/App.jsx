import './App.css';
import { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState('');
  const [budget, setBudget] = useState(0);
  const [serverResponse, setServerResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/process-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: userInput, budget: budget }),
      });

      const data = await response.json();
      setServerResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Prosperiti</h1>
      <h2>AI Personal Planner Assistant</h2>
      <div className="card">
        <h3><i>I'm looking for:</i></h3>
        <form id="user-search-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="user-input-entry" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} 
          />
          <h3><i>On a budget of:</i></h3>
          <input type="number" id="budget" name="budget" min="0" max="100000" onChange={(e) => setBudget(e.target.value)}></input>
          <br></br><button type="submit">Submit</button>
        </form>
        {serverResponse && <div className="response">{serverResponse}</div>}
      </div>
    </div>
  );
}

export default App;
