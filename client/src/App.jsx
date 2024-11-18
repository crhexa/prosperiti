import './App.css';
import { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState('');
  const [budget, setBudget] = useState(0);
  const [serverResponse, setServerResponse] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessage] = useState(['']
)
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  };

  return (
    <div id="app-main">
      <h1>Prosperiti</h1>
      <h2>AI Personal Planner Assistant</h2>
      <div className="card">
        <form id="user-search-form" onSubmit={handleSubmit}>
          <label htmlFor="user-input-entry"><i>I'm looking for:</i></label >
          <input 
            type="text" 
            id="user-input-entry" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} 
          />
          <label htmlFor='budget'><i>On a budget of:</i></label >
          <input type="number" id="budget" name="budget" min="0" max="100000" onChange={(e) => setBudget(e.target.value)} />
          <br /><button type="submit">Search</button>
        </form>
        <span id='response'>
          {serverResponse && <div className="response">{serverResponse}</div>}
        </span>
      </div>
      <button className="toggle-themes-button" onClick={toggleDarkMode}>
        {darkMode ? '☾' : '☼'}
      </button>
    </div>
  );
}

export default App;
