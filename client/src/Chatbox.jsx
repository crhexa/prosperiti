import { useEffect, useRef } from "react";
import Message from "./Message.jsx";

export default function Chatbox({messages}){

    const focusBottom = useRef(null);

    useEffect(() => {
        focusBottom.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="border rounded p-3 w-6xl min-h-[600px] max-h-[600px] m-5 ml-0 overflow-y-auto bg-gray-100 dark:bg-gray-800 dark:text-white shadow ">
            {messages.map((msg, i) => (
                <Message key={i} origin={msg.origin} body={msg.message} />
            ))}
            <div ref={focusBottom} />
        </div>
    );
};
