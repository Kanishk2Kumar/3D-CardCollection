"use client";
import React, { useState } from "react";
import Link from "next/link";

const TrackSelectionPage = () => {
  const [selectedTrack, setSelectedTrack] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const tracks = [
    {
      id: 1,
      name: "Forest Path",
      description: "A mysterious track covered by ancient trees.",
      image: "/images/tracks/RaceTrack1.png",
    },
    {
      id: 2,
      name: "Lava Road",
      description: "A treacherous track with molten lava.",
      image: "/images/tracks/RaceTrack2.jpeg",
    },
  ];

  const handleTrackSelect = (track: { name: string; image: string }) => {
    setSelectedTrack(track);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center pt-20">
      <h1 className="special-font hero-heading my-10 !text-6xl">
        <b>Select</b> a <b>Track</b> for NFT Card Battle
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 items-center justify-center min-w-screen mx-20 my-10">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 hover:scale-105 transition-transform"
            onClick={() => handleTrackSelect(track)}
          >
            <img
              src={track.image}
              alt={track.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">{track.name}</h2>
              <p className="text-sm">{track.description}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedTrack && (
        <div className="mt-8 p-4 bg-gray-900 rounded-md flex flex-col items-center">
          <p className="mb-4">
            <span className="font-bold text-red-500">Confirm Selected Track:</span>{" "}
            {selectedTrack.name}
          </p>
          <Link
            href={{
              pathname: `/${selectedTrack.name.toLowerCase().replace(/\s+/g, "-")}`,
              query: {
                track: selectedTrack.name,
                image: selectedTrack.image,
              },
            }}
          >
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition">
              Confirm Track
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TrackSelectionPage;
