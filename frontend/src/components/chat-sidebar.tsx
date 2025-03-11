import { useState } from "react";
import { useSocket } from "../hooks/useSocket";

const ChatSidebar = () => {
  const [message, setMessage] = useState("");

  const {
    _sendMessageToRoom = () => null,
    notifications = [],
    messages = [],
    rooms,
    sendTypingEvent = () => null,
    usersTyping = [],
    socketConnected = false,
    exitRoom = () => null,
  } = useSocket();

  console.log({ usersTyping });

  const handleExit = () => {
    rooms.length > 0 ? exitRoom(rooms[0]) : null;
  };

  console.log(rooms);

  return (
    <div className="h-full w-[230px]">
      <div className="h-full border-2 bg-slate-200 w-full flex flex-col justify-between gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl">
              Room Chat {rooms.length > 0 && `(${rooms[0]})`}
            </span>{" "}
            <span
              className={`p-2 rounded-full ${
                socketConnected ? "bg-green-400" : "bg-orange-400"
              }`}
            ></span>
          </div>
          <div>
            <button type="button" onClick={() => handleExit()}>
              <svg
                className="w-6 h-6 text-black"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-1 flex-grow">
          {notifications?.length > 0 &&
            notifications?.map((msg) => (
              <p className="bg-slate-400 p-2 text-sm">{msg || ""}</p>
            ))}
          {messages?.length > 0 &&
            messages?.map(({ user, message }) => (
              <>
                <p className="bg-slate-400 p-2">{user || ""}</p>
                <p className="bg-slate-400 p-2">{message || ""}</p>
              </>
            ))}
          {usersTyping?.length > 0 &&
            usersTyping?.map((user) => <p>{user} is typing...</p>)}
        </div>
        <div className="w-full p-2 flex">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => sendTypingEvent(true)}
            onBlur={() => sendTypingEvent(false)}
          />
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
