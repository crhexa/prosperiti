
import { useNavigate } from "react-router-dom";
import NavbarDefault from "./NavbarDefault";
import { Button, Carousel } from "flowbite-react";

export default function Home() {
    const navigate = useNavigate();

    const chatHandler = () => {
        navigate('/chat');
    }
    
    return (
        <>
        <NavbarDefault/>
        <div className="flex flex-col items-center justify-center text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold">Your <span className="text-blue-500">AI</span> Personal Assistant</h1>
            <Button onClick={chatHandler} className="px-6 py-3 text-lg mb-6">Try it out</Button>
        </div>
            <div className="h-70 sm:h-78 xl:h-94 2xl:h-110 px-4 md:px-8 max-w-screen-xl mx-auto px-6">
            <Carousel pauseOnHover>
            <img src="https://www.shutterstock.com/image-photo/tabby-cat-stands-on-rock-600nw-1991451257.jpg" alt="..." />
            <img src="https://www.whiskas.co.uk/cdn-cgi/image/format=auto,q=90/sites/g/files/fnmzdf5651/files/2025-02/why-do-cats-purr_.jpg" alt="..." />
            <img src="https://thejapans.org/wp-content/uploads/2013/02/f13021106.jpg" alt="..." />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTazUT-1rD-JLnRdNJeK_oIN476-NCb1KysdA&s" alt="..." />
            <img src="https://i.ytimg.com/vi/2AslPYz5fg0/sddefault.jpg" alt="..." />
            </Carousel>
        </div>
        </>
    );
}
