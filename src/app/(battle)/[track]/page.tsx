import React from "react";

const TrackPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ track: string }>;
  searchParams: Promise<{ image: string }>;
}) => {
  // Resolve the Promises
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { track } = resolvedParams;
  const { image } = resolvedSearchParams;
  // Number of cards
  const numberOfCards = 5;

  // Semi-circle radius
  const radius = 180;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-between z-50"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Top Semi-Circle of Cards */}
      <div className="relative w-full h-36 flex justify-center items-center">
        {Array.from({ length: numberOfCards }, (_, index) => {
          const angle = (Math.PI / (numberOfCards - 1)) * index; // Evenly space cards in semi-circle
          const x = radius * Math.cos(angle); // Calculate X position
          const y = radius * Math.sin(angle); // Calculate Y position

          return (
            <div
              key={index}
              className="absolute w-20 h-32 rounded-md border-2 border-white flex items-center justify-center text-center text-white font-bold text-xs"
              style={{
                backgroundImage: `url('/images/Blankcard.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <h1 className="font-mono">Voxel <br />Vaults</h1>
            </div>
          );
        })}
      </div>

      {/* Bottom Semi-Circle of Cards */}
      <div className="relative w-full h-32 flex justify-center items-center bottom-0">
        {Array.from({ length: numberOfCards }, (_, index) => {
          const angle = (Math.PI / (numberOfCards - 1)) * index; // Evenly space cards in semi-circle
          const x = radius * Math.cos(angle); // Calculate X position
          const y = -radius * Math.sin(angle); // Calculate Y position

          return (
            <div
              key={index}
              className="absolute w-20 h-36 rounded-md border-2 border-white flex items-center justify-center text-center text-white font-bold text-xs"
              style={{
                backgroundImage: `url('/images/Blankcard.jpeg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
            <h1 className="font-mono">Voxel <br />Vaults</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackPage;
