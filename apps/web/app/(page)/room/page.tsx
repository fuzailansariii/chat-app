"use client";

import React, { useRef, useState, useEffect } from "react";
import RoomCard from "../../components/RoomCard";
import CreateRoom from "../../components/CreateRoom";
import JoinRoom from "../../components/JoinRoom";

export default function Room() {
  const [modelType, setModelType] = useState<"create" | "join" | null>(null);
  const modelRef = useRef<HTMLDialogElement | null>(null);

  //   the modal opens when modelType changes
  useEffect(() => {
    if (modelType && modelRef.current) {
      modelRef.current.showModal();
    }
  }, [modelType]);

  const handleOpenModal = (type: "create" | "join") => {
    setModelType(type); // Set the type, and useEffect will handle showing the modal
  };

  const handleCloseModal = () => {
    setModelType(null);
    if (modelRef.current) {
      modelRef.current.close();
    }
  };

  return (
    <div className="md:max-w-7xl mx-auto p-4 flex flex-col justify-center items-center">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Room</h1>
        <div className="flex gap-4 justify-items-center">
          <button
            className="btn btn-outline btn-sm md:btn-md"
            onClick={() => handleOpenModal("join")}
          >
            Join Room
          </button>
          <button
            className="btn btn-outline btn-sm md:btn-md"
            onClick={() => handleOpenModal("create")}
          >
            Create Room
          </button>
        </div>
        {/* Dialog with ref */}
        <dialog ref={modelRef} className="modal">
          <div className="modal-box">
            {modelType === "create" && (
              <CreateRoom
                type="text"
                modelRef={modelRef}
                handleCloseModal={handleCloseModal}
                placeholder="Enter room name"
                title="Create Room"
              />
            )}
            {modelType === "join" && (
              <JoinRoom
                type="text"
                modelRef={modelRef}
                handleCloseModal={handleCloseModal}
                placeholder="Enter room Id"
                title="Join Room"
              />
            )}
          </div>
        </dialog>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        <RoomCard cardTitle="Room 1" cardDescription="This is the first room" />
        <RoomCard
          cardTitle="Room 2"
          cardDescription="This is the second room"
        />
        <RoomCard cardTitle="Room 3" cardDescription="This is the third room" />
      </div>
    </div>
  );
}
