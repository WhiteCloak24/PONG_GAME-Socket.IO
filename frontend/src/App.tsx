/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"

function App() {
  const [selfPos, setSelfPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<any>(null)
  const selfBoardRef = useRef<any>(null)
  const isMouseDown = useRef<any>(false)

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    containerRef.current.addEventListener('mousedown', handleMouseDown)
    containerRef.current.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      containerRef.current.removeEventListener('mousedown', handleMouseDown)
      containerRef.current.removeEventListener('mouseup', handleMouseUp)
    }
  }, [containerRef.current])

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault();
    if (!isMouseDown.current) return
    const containerBounds = containerRef.current?.getBoundingClientRect()
    const selfBounds = selfBoardRef.current?.getBoundingClientRect()
    if (containerBounds.bottom < selfBounds.bottom) {
      setSelfPos({ x: 0, y: (containerBounds.height - selfBounds.height) / 2 })
      return
    }
    if (containerBounds.top > selfBounds.top) {
      setSelfPos({ x: 0, y: - (containerBounds.height - selfBounds.height) / 2 })
      return
    }
    if (containerBounds.bottom >= (selfBounds.bottom + e.movementY) && containerBounds.top <= (selfBounds.top + e.movementY)) {
      setSelfPos(prev => ({ x: 0, y: prev.y + e.movementY }))
      return
    }
  }

  function handleMouseDown() {
    isMouseDown.current = true
  }
  function handleMouseUp() {
    isMouseDown.current = false
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-5/6 h-full flex items-center justify-center flex-col gap-4">
        <div className="flex items-center h-20">Room Code : 1234</div>
        <div ref={containerRef} className="rounded-md border-4 h-5/6 w-full relative cursor-pointer">
          {/* <div className="absolute h-full w-2 bg-black left-1/2" /> */}
          <div id="self_player" ref={selfBoardRef} className="absolute h-1/6 w-2 bg-blue-500 left-0" style={{
            top: '50%',
            transform: 'translateY(-50%)',
            translate: `0px ${selfPos.y}px`
          }}

          />
          <div id="opp_player" className="absolute h-1/6 w-2 bg-red-500 right-0" style={{
            top: '50%',
            transform: 'translateY(-50%)'
          }} />

        </div>
      </div>
    </div>
  )
}

export default App
