import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Prosperiti</h1>
      <h2>AI Personal Planner Assisant</h2>
      <div className="card">
        <form id="user-input" >
            <input type="text"></input>
        </form>
      </div>
    </>
  )
}

export default App
