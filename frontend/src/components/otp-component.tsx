import React, { FC, useRef, useState } from "react";

const otpLength = 4;

interface OTPInputProps {
  submitText?: string;
  submitFunction?: (otp: string) => void;
}

const OTPInput: FC<OTPInputProps> = ({
  submitFunction = () => null,
  submitText = "Submit",
}) => {
  const [input, setInput] = useState<string[]>([]);
  const inputNodesRef = useRef<Array<HTMLInputElement> | null>([]);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const otp = input.join("");
      if (otp && otp?.length >= 4) {
        submitFunction(otp);
      }
    }
  };

  return (
    <div className="flex gap-2">
      {new Array(otpLength).fill(-1).map((_, index) => {
        return (
          <div className="max-w-xs space-y-3">
            <input
              type="text"
              className="py-3 px-4 block w-16 rounded-lg text-sm border-gray-400 border-2 focus:border-blue-500 focus:ring-blue-500 outline-none"
              ref={(el) => {
                if (!Array.isArray(inputNodesRef.current))
                  inputNodesRef.current = [];
                if (el) inputNodesRef.current[index] = el;
              }}
              value={input[index] || ""}
              onChange={(e) => {
                let inputStr = e.target.value;
                if (!inputStr && inputNodesRef.current) {
                  setInput((prev) => {
                    prev[index] = "";
                    return prev.slice(0);
                  });
                  if (index - 1 >= 0) inputNodesRef.current[index - 1].focus();
                  return;
                }
                inputStr = inputStr.split("")[inputStr.length - 1];
                const inputValue = Number(inputStr);
                if (inputValue && !isNaN(inputValue)) {
                  setInput((prev) => {
                    prev[index] = String(inputValue);
                    if (!(index + 1 < otpLength)) {
                      const otp = input.join("");
                      if (otp && otp?.length >= 4) {
                        submitFunction(otp);
                      }
                    }
                    return prev.slice(0);
                  });
                  if (index + 1 < otpLength) {
                    if (inputNodesRef.current)
                      inputNodesRef.current[index + 1].focus();
                  }
                }
              }}
              onKeyDown={handleEnterKey}
            />
          </div>
        );
      })}
      <button
        type="button"
        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        onClick={() => submitFunction(input.join(""))}
      >
        {submitText}
      </button>
    </div>
  );
};

export default OTPInput;
