import { useEffect, useRef } from "react";
import Message from "./Message.jsx";

export default function Chatbox({messages}){

    const focusBottom = useRef(null);

    useEffect(() => {
        focusBottom.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="border rounded-lg p-4 w-full max-w-3xl min-h-[500px] max-h-[600px] m-5 ml-0 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-white shadow-lg space-y-3">
            {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.origin === "user" ? "justify-end" : "justify-start"
          }`}
        >
            <div
            className={`p-3 max-w-[80%] rounded-xl shadow-sm ${
                msg.origin === "user"
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
            }`}
            >
            <Message body={msg.message} />
            </div>
        </div>
        ))}
        <div ref={focusBottom} />
    </div>
    );
}
