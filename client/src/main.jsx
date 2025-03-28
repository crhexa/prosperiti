import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Signup from './Signup.tsx';
import Login from './Login.tsx';
import Home from './Home.jsx';
import Foot from './Foot.jsx';
import About from './About.jsx';
import NavbarDefault from './NavbarDefault.jsx'
import { Contact } from './Contact.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NavbarDefault/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<App />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/contact" element={<Contact />}/>
    </Routes>
    <Foot/>
</BrowserRouter>
)
