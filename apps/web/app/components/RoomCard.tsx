import React from "react";

interface RoomCardProps {
  cardTitle: string;
  cardDescription: string;
}

export default function RoomCard({
  cardTitle,
  cardDescription,
}: RoomCardProps) {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">{cardTitle}</h2>
          <button className="btn btn-outline btn-md">Join</button>
        </div>
        <p>
          Joining Id: <span className="font-semibold">{cardDescription}</span>
        </p>
      </div>
    </div>
  );
}
