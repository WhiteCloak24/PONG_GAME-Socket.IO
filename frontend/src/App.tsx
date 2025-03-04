/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import JoinRoomModal from "./components/join-room-modal";

function App() {
  const [selfPos, setSelfPos] = useState({ x: 0, y: 0 });
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [stopBall, setStopBall] = useState(true);
  const [message, setMessage] = useState("");

  const {
    opponentsPos = { x: 0, y: 0 },
    updatePos,
    rooms,
    _sendMessageToRoom = () => null,
    notifications = [],
    messages = [],
  } = useSocket();

  // console.log({ opponentsPos });

  const containerRef = useRef<any>(null);
  const bottomBoundRef = useRef<any>(null);
  const topBoundRef = useRef<any>(null);
  // const leftBoundRef = useRef<any>(null);
  const rightBoundRef = useRef<any>(null);

  const ballDirection = useRef<any>("R");
  const ballSpeed = useRef<any>(2);
  const yMovement = useRef<any>(0);

  const selfBoardRef = useRef<any>(null);
  const oppBoardRef = useRef<any>(null);

  const ballRef = useRef<any>(null);
  const isMouseDown = useRef<any>(false);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    calculateInitialBallPos();
    setTimeout(() => {
      requestAnimationFrame(startBallMovement);
      requestAnimationFrame(impactAnalyzer);
    }, 1000);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      containerRef.current.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (selfPos) {
      updatePos(selfPos);
    }
  }, [selfPos]);

  function impactAnalyzer() {
    checkBoundCollision();
    checkBoardsCollision();
    requestAnimationFrame(impactAnalyzer);
  }

  function checkBoardsCollision() {
    const ballRect = ballRef.current.getBoundingClientRect();

    const selfBoundsRect = selfBoardRef.current.getBoundingClientRect();
    const oppBoundsRect = oppBoardRef.current.getBoundingClientRect();
    const isSelfImpact = checkImpact(ballRect, selfBoundsRect);
    const isOppImpact = checkImpact(ballRect, oppBoundsRect);
    if (isSelfImpact) {
      ballDirection.current = "R";
      const val = Math.random() * 2 - 1;
      calculateYMovement(val);
    }
    if (isOppImpact) {
      ballDirection.current = "L";
      const val = Math.random() * 2 - 1;
      calculateYMovement(val);
    }
    // if (ballRect.left < selfBoundsRect.right) {
    //   ballDirection.current = 'R'
    //   const val = Math.random() * 2 - 1;
    //   calculateYMovement(val)
    // }
    // if (ballRect.right > oppBoundsRect.left) {
    //   ballDirection.current = 'L'
    //   const val = Math.random() * 2 - 1;
    //   calculateYMovement(val)
    // }
  }
  function checkBoundCollision() {
    const ballRect = ballRef.current.getBoundingClientRect();

    const topBoundaryRect = topBoundRef.current.getBoundingClientRect();
    // const leftBoundaryRect = leftBoundRef.current.getBoundingClientRect();
    // const rightBoundaryRect = rightBoundRef.current.getBoundingClientRect();
    const bottomBoundaryRect = bottomBoundRef.current.getBoundingClientRect();
    // if (ballRect.left < leftBoundaryRect.right) {
    //   ballDirection.current = "R";
    // }
    // if (ballRect.right > rightBoundaryRect.left) {
    //   ballDirection.current = "L";
    // }
    if (ballRect.bottom >= bottomBoundaryRect.top) {
      calculateYMovement(0, "up");
      // setStopBall(true);
    } else if (ballRect.top <= topBoundaryRect.bottom) {
      calculateYMovement(0, "down");
      // setStopBall(true);
    }
  }

  function calculateYMovement(val: number, direction?: "up" | "down") {
    console.log({ direction });

    if (val) {
      yMovement.current = val;
    } else {
      // yMovement.current = -yMovement.current;
      // down -> positive
      // up -> negative

      if (direction === "up") {
        yMovement.current = 0 - Math.abs(yMovement.current);
      }
      if (direction === "down") {
        yMovement.current = Math.abs(yMovement.current);
      }
    }
  }

  function checkImpact(ref1Bound: any, ref2Bound: any) {
    return (
      ref1Bound.right > ref2Bound.left &&
      ref1Bound.left < ref2Bound.right &&
      ref1Bound.bottom > ref2Bound.top &&
      ref1Bound.top < ref2Bound.bottom
    );
  }
  function startBallMovement() {
    const step = ballSpeed.current;
    if (stopBall) return 0;

    switch (ballDirection.current) {
      case "L":
        setBallPos((prev) => ({
          y: prev.y + yMovement.current,
          x: prev.x - step,
        }));
        break;
      case "R":
        setBallPos((prev) => ({
          y: prev.y + yMovement.current,
          x: prev.x + step,
        }));
        break;

      default:
        break;
    }
    requestAnimationFrame(startBallMovement);
  }

  function calculateInitialBallPos() {
    const containerBounds = containerRef.current?.getBoundingClientRect();
    setBallPos({ x: containerBounds.width / 2, y: containerBounds.height / 2 });
  }
  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();
    if (!isMouseDown.current) return;
    const containerBounds = containerRef.current?.getBoundingClientRect();
    const selfBounds = selfBoardRef.current?.getBoundingClientRect();
    if (containerBounds.bottom < selfBounds.bottom) {
      setSelfPos({ x: 0, y: (containerBounds.height - selfBounds.height) / 2 });
      return;
    }
    if (containerBounds.top > selfBounds.top) {
      setSelfPos({
        x: 0,
        y: -(containerBounds.height - selfBounds.height) / 2,
      });
      return;
    }
    if (
      containerBounds.bottom >= selfBounds.bottom + e.movementY &&
      containerBounds.top <= selfBounds.top + e.movementY
    ) {
      setSelfPos((prev) => ({ x: 0, y: prev.y + e.movementY }));
      return;
    }
  }

  function handleMouseDown() {
    isMouseDown.current = true;
  }
  function handleMouseUp() {
    isMouseDown.current = false;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-5/6 h-full flex items-center justify-center flex-col gap-4">
        <div className="flex items-center h-20">
          Room Code : {rooms.length > 0 && rooms[0]}
        </div>
        <div
          ref={containerRef}
          className="rounded-md border-4 h-5/6 w-full relative cursor-pointer"
        >
          {/* <div
            ref={leftBoundRef}
            className="absolute h-full w-2 bg-black left-0"
          ></div> */}
          {/* <div
            ref={rightBoundRef}
            className="absolute h-full bg-black w-2 right-0"
          ></div> */}
          <div
            ref={topBoundRef}
            className="absolute h-2 w-full bg-black top-0"
          ></div>
          <div
            ref={bottomBoundRef}
            className="absolute h-2 w-full bg-black bottom-0"
          ></div>
          <div
            id="self_player"
            ref={selfBoardRef}
            className="absolute h-1/6 w-2 bg-blue-500 left-0"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              translate: `0px ${selfPos.y}px`,
            }}
          />
          <div
            ref={ballRef}
            className="absolute rounded-full w-3 h-3 bg-black"
            style={{
              top: `${ballPos.y}px`,
              left: `${ballPos.x}px`,
              transform: "translate(-50%,-50%)",
            }}
          />
          <div
            id="opp_player"
            ref={oppBoardRef}
            className="absolute h-1/6 w-2 bg-red-500 right-0"
            style={{
              top: "50%",
              translate: `0px ${opponentsPos?.y}px`,
            }}
          />
        </div>
      </div>
      {!rooms.length && <JoinRoomModal />}
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
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
    </div>
  );
}

export default App;
