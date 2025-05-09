
import { useNavigate } from "react-router-dom";
import { Button, Carousel } from "flowbite-react";

export default function Home() {
    const navigate = useNavigate();

    const chatHandler = () => {
        navigate('/chat');
    }
    
    return (
        <>
        <div className="flex flex-col items-center justify-center text-center space-y-6 mt-20 overflow-hidden">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold">Your <span className="text-blue-500">AI</span> Personal Assistant</h1>
            <Button onClick={chatHandler} className="px-6 py-3 text-xl mb-6">Try it out! </Button>
        </div>
        <div className="h-70 sm:h-78 xl:h-94 2xl:h-110 px-4 md:px-6 max-w-3xl mx-auto">
            <Carousel pauseOnHover>
                <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D" alt="..." />
                <img src="https://media.istockphoto.com/id/1474847847/photo/asian-woman-blogger-outdoors.jpg?s=612x612&w=0&k=20&c=7McSrAXSryAmNHoL0Lsk6ZQSo-HFiynWqjmLnWoV0GE=" alt="..." />
                <img src="https://media.istockphoto.com/id/592680860/photo/meditating-in-prayer-pose.jpg?s=612x612&w=0&k=20&c=PjYvLch0SS9L5fgDnobw_T-mcN6VoLMc3A866wAhhWk=" alt="..." />
                <img src="https://media.istockphoto.com/id/1357967978/photo/happy-group-of-people-in-a-pottery-class.jpg?s=612x612&w=0&k=20&c=P2PJX2laZeukSSxP6_lW3f6rvseXATz9kjR7F9h-Ch0=" alt="..." />
                <img src="https://s3.amazonaws.com/assets.centralparknyc.org/media/images/_1650x767_crop_center-center_none/Biking_IMG_0283.jpg" alt="..." />
                <img src="https://images.ctfassets.net/mviowpldu823/5771iS3eOAewXA8x974MRi/faf5fe62bf9fdf1398619cd1df094dfd/311_0063__1_.jpeg" alt="..." />
            </Carousel>
        </div>
        </>
    );
}