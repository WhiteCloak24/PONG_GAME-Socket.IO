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
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
            <OTPInput submitFunction={joinRoom} submitText="Join" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;
