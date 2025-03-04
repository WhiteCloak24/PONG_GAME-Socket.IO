import { FC, ReactNode } from "react";
import OTPInput from "./otp-component";
import { useSocket } from "../hooks/useSocket";

interface BaseModalProps {
  modalTitle?: string;
  handleClose?: () => void;
  header?: ReactNode;
}

const JoinRoomModal: FC<BaseModalProps> = () => {
  const modalTitle = "Join Room";
  const { joinRoom } = useSocket();
  return (
    <div className="fixed h-screen w-screen bg-black bg-opacity-45">
      <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
          <div className="flex justify-center items-center py-3 px-4 border-b">
            <h3 className="font-bold text-gray-800">{modalTitle}</h3>
            {/* <button
              type="button"
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="sr-only">Close</span>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button> */}
          </div>
          {/* <div className="p-4 overflow-y-auto">
            <p className="text-gray-800">
              This is a wider card with supporting text below as a natural
              lead-in to additional content.
            </p>
          </div> */}
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
            <OTPInput submitFunction={joinRoom} submitText="Join" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;
