import React, { useEffect, useState } from 'react';
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, Button, NavbarToggle } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.ts'; 

export default function NavbarDefault() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
    }
  };

  return (
    <Navbar
      fluid
      rounded={false}
      className="w-full bg-white dark:bg-gray-900 dark:text-white"
    >
      <div className="max-w-screen-xl w-full mx-auto px-4 flex flex-wrap items-center justify-between">
        <NavbarBrand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Prosperiti
          </span>
        </NavbarBrand>
        <div className="flex md:order-2 space-x-2">
          {loading ? ( 
            <div></div>
          ) : user ? (
            <Button onClick={handleLogout} className="bg-red-500 text-white">
              Logout
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} className="bg-blue-500 text-white">
                Login
              </Button>
              <Button onClick={() => navigate('/signup')} className="bg-blue-700 text-white">
                Sign Up
              </Button>
            </>
          )}
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="/chat">Search</NavbarLink>
          <NavbarLink href="/about">About</NavbarLink>
          <NavbarLink href="/contact">Contact</NavbarLink>
        </NavbarCollapse>
      </div>
    </Navbar>
  );
}
