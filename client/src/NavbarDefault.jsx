import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, Button, NavbarToggle } from 'flowbite-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

export default function NavbarD() {
  const navigate = useNavigate(); // Hook to handle navigation

  const handleSignUp = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  const handleLogin = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <Navbar fluid rounded className="max-w-screen-xl mx-auto px-6 mb-2">
      <NavbarBrand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Prosperiti
        </span>
      </NavbarBrand>
      <div className="flex md:order-2 space-x-2 ">  
        <Button onClick={handleLogin}>Log In</Button>
        <Button onClick={handleSignUp}>Sign Up</Button> 
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="/" active>
          Home
        </NavbarLink>
        <NavbarLink href="/about">About</NavbarLink>
        <NavbarLink href="/contact">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
