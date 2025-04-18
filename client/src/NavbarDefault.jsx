import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, Button, NavbarToggle, } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function NavbarD() {
  const navigate = useNavigate();

  const handleSignUp = () => navigate('/signup');
  const handleLogin = () => navigate('/login');

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
          <Button onClick={handleLogin}>Log In</Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
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
