import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

const ChatSidebar = () => {
  const [message, setMessage] = useState("");

  const {
    _sendMessageToRoom = () => null,
    notifications = [],
    messages = [],
  } = useSocket();
  return (
    <div className="h-full w-[230px]">
      <div className="h-full border-2 bg-slate-200 w-full flex flex-col justify-between">
        <div className="w-full justify-end">
          <h1>govind</h1>
        </div>
        <div className="w-full justify-end flex flex-col gap-1">
          {notifications?.length > 0 &&
            notifications?.map((msg) => (
              <p className="bg-slate-400 p-2">{msg || ""}</p>
            ))}
          {messages?.length > 0 &&
            messages?.map(({ user, message }) => (
              <>
                <p className="bg-slate-400 p-2">{user || ""}</p>
                <p className="bg-slate-400 p-2">{message || ""}</p>
              </>
            ))}
        </div>
        <div className="w-full p-2 flex">
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button
            className="bg-blue-300 cursor-pointer"
            onClick={() => {
              if (message) {
                _sendMessageToRoom(message);
              }
            }}
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
