import React from "react";

interface CardProps {
  nft: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

const Card = ({ nft }: CardProps) => {
  return (
    <div className="bg-gray-100 shadow rounded-lg overflow-hidden">
      <img
        src={nft.image}
        alt={nft.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-black">{nft.title}</h2>
        <p className="text-[#13ADB7] font-medium">${nft.price}</p>
        <button className="mt-4 w-full bg-[#13ADB7] text-white py-2 rounded hover:bg-[#0e8d93]">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Card;
