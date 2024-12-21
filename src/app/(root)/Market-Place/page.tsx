"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // Import framer-motion
import { useActiveWallet } from "thirdweb/react";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import { defineChain, getContract, sendTransaction } from "thirdweb";
import { client } from "../../client";
import { MARKET_CONTRACT_ADDRESS } from "../../../const/addresses";
import { PinContainer } from "@/components/ui/3d-pin";
import { buyFromListing } from "thirdweb/extensions/marketplace";

type Listing = {
  asset: {
    metadata: {
      name: string;
      image: string;
      description: string;
    };
    supply: bigint;
  };
  currencyValuePerToken: {
    displayValue: string;
  };
};

export default function Shop() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");

  const walletInfo = useActiveWallet();
  const account = useActiveAccount();
  const chain = defineChain(walletInfo?.getChain()?.id ?? 11155111);

  const market = getContract({
    address: MARKET_CONTRACT_ADDRESS,
    chain,
    client,
  });

  useEffect(() => {
    const fetchValidListings = async () => {
      try {
        const lists = await getAllValidListings({
          contract: market,
          start: 0,
          count: BigInt(10),
        });
        setListings(lists);
      } catch (error) {
        console.error("Error fetching valid listings:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchValidListings();
  }, [market]);

  const formatIpfsUrl = (url: string) => {
    return url.replace(
      "ipfs://",
      "https://d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io/ipfs/"
    );
  };

  const buyNFtT = async (listingId: number) => {
    const transaction = await buyFromListing({
      contract: market,
      listingId: BigInt(listingId),
      quantity: 1n,
      recipient: account?.address || "",
    });

    if (!account) {
      console.error("Account not found");
      return;
    }

    await sendTransaction({
      transaction,
      account: account,
    });
  };

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

        {isLoading ? (
          <div>
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <motion.div
                className="border-t-4 border-blue-500 rounded-full w-16 h-16"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              />
            </motion.div>
            <h1 className="text-3xl font-bold mb-8 text-center font-medieval">
              Loading Lists ...
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {listings.map((listing, index) => (
              <PinContainer
                key={index}
                title={listing.asset.metadata.name}
                className="w-[300px] h-[400px] p-6 bg-black text-white"
              >
                <motion.div
                  className="relative w-full rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Image Section */}
                  <div
                    className="bg-cover bg-center h-40"
                    style={{
                      backgroundImage: `url(${formatIpfsUrl(
                        listing.asset.metadata.image
                      )})`,
                    }}
                  />

                  {/* Content Section */}
                  <div className="p-4 flex flex-col space-y-2 relative">
                    <h2 className="text-xl font-bold text-white">
                      {listing.asset.metadata.name}
                    </h2>
                    <p className="text-sm text-gray-300 h-10 overflow-y-auto">
                      {listing.asset.metadata.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Amount left: {listing.quantity.toString()}
                      </span>
                      <span className="font-bold text-green-600">
                        {listing.currencyValuePerToken.displayValue} ETH
                      </span>
                    </div>
                    {/* Buy Now Button */}
                    {!account ? (
                      <p className="text-red-500 text-sm mt-2">
                        Please Connect Wallet
                      </p>
                    ) : (
                      <button
                        onClick={buyNFtT.bind(null, listing.id)}
                        className="mt-4 py-2 text-sm font-bold bg-gray-700 text-white rounded hover:bg-gray-600 w-full"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </motion.div>
              </PinContainer>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
