"use client";

import React, { useRef, useState, useEffect } from "react";
import RoomCard from "../../components/RoomCard";
import CreateRoom from "../../components/CreateRoom";
import JoinRoom from "../../components/JoinRoom";
import axios from "axios";

type Room = {
  id: string;
  name: string;
  joiningId: string | null;
  createdBy?: string | null;
  createdAt?: string;
};

export default function Room() {
  const [token, setToken] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modelType, setModelType] = useState<"create" | "join" | null>(null);
  const modelRef = useRef<HTMLDialogElement | null>(null);

  //   the modal opens when modelType changes
  useEffect(() => {
    if (modelType && modelRef.current) {
      modelRef.current.showModal();
    }
  }, [modelType]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get("/api/rooms");
      if (response) {
        const fetchedRooms = response.data.rooms;
        // console.log("Rooms: ", fetchedRooms);
        setRooms(fetchedRooms);
      }
    };
    fetchRooms();
  }, []);

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
        {
          <div>
            <button
              className="cursor-pointer  p-4 rounded-lg border"
              onClick={async () => {
                const response = await axios.get("/api/getUser");
                setToken(response.data.rawToken);
              }}
            >
              get user raw token
            </button>
            <p>{token}</p>
          </div>
        }
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            cardTitle={room.name}
            cardDescription={room.joiningId ?? "No joining ID"}
          />
        ))}
      </div>
    </div>
  );
}
