"use client";
import React, { useState } from "react";
import { PinContainer } from "@/components/ui/3d-pin";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");

  const nftData = [
    {
      id: 1,
      title: "BMW-M5",
      description: "Sleek and timeless, unparalleled performance.",
      price: 10,
      image: "./images/BMW-M5.png",
    },
    {
      id: 2,
      title: "Lamborghini Aventador",
      description: "Exudes raw power with stunning aerodynamics.",
      price: 15,
      image: "/images/Lamborghini.png",
    },
    {
      id: 3,
      title: "Porsche 911 (930)",
      description: "The legendary Porsche 911 (930) - a true classic of its era.",
      price: 12,
      image: "/images/Porche911(930).png",
    },
    {
      id: 4,
      title: "Porsche 911",
      description: "A hybrid marvel, redefining speed and sophistication.",
      price: 18,
      image: "/images/Porche911.png",
    },
    {
      id: 5,
      title: "McLaren",
      description: "The ultimate blend of precision and performance.",
      price: 20,
      image: "/images/MCLaren.png",
    },
  ];

  const filteredNFTs = nftData
    .filter((nft) =>
      nft.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="min-h-screen bg-black text-white p-16 pb-40 pt-20">
      <div className="flex flex-col items-center">
        <h1 className="special-font hero-heading text-red-800 mb-6 !text-6xl">
          3D Car NFT Marketplace
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mb-8">
          <input
            type="text"
            placeholder="Search for NFTs..."
            className="flex-grow px-4 py-2 border rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded bg-gray-800 text-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="price-asc">Sort by: Price (Low to High)</option>
            <option value="price-desc">Sort by: Price (High to Low)</option>
            <option value="alphabetical">Sort by: Alphabetical</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24 w-full max-w-6xl px-4 mt-16">
          {filteredNFTs.map((nft) => (
            <PinContainer
            key={nft.id}
            title={nft.title}
            className="w-[300px] h-[400px] p-6 bg-black text-white mt-10"
          >
            <div
              key={nft.id}
              className="relative w-full rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition duration-300"
            >
              <div
                className="bg-cover bg-center h-40"
                style={{ backgroundImage: `url(${nft.image})` }}
              />
              <div className="p-4 flex flex-col space-y-2">
                <h2 className="text-xl font-bold text-white">{nft.title}</h2>
                <p className="text-sm text-gray-300">{nft.description}</p>
                <p className="text-lg font-semibold text-white">
                  ${nft.price}
                </p>
              </div>
              <button className="absolute bottom-4 right-4 px-4 py-2 text-sm font-bold bg-gray-700 text-white rounded hover:bg-gray-600">
                Buy Now
              </button>
            </div>
          </PinContainer>          
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
