import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Signup from './Signup.tsx';
import Login from './Login.tsx';
import Home from './Home.jsx';
import Foot from './Foot.jsx';
import About from './About.jsx';
import NavbarDefault from './NavbarDefault.jsx';
import Contact from './Contact.jsx';
import NotFound from './NotFound.jsx';

const Root = () => {
  const location = useLocation();
  const showFooter = location.pathname !== '/chat';

  return (
    <>
      <NavbarDefault />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFooter && <Foot />}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);
