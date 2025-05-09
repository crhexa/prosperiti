import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";

export default function Chatbox({ messages, loading }) {
    const focusBottom = useRef(null);

    useEffect(() => {
        focusBottom.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
    <div className="border rounded-lg p-4 w-full max-w-3xl min-h-[600px] max-h-[600px] m-5 ml-0 overflow-y-auto bg-gray-50 dark:bg-gray-900 dark:text-white shadow-lg space-y-3">
        {messages.map((msg, i) => (
        <div key={i} className={`flex ${
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
        {loading && (
                <Message body={
                <div className="p-3 max-w-fit rounded-xl shadow-sm bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-white flex justify-start">
                    <svg className="animate-spin h-6 w-6 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="mr-2">Loading...</p>
                </div>} />
        )}
        <div ref={focusBottom} />
    </div>
    );}