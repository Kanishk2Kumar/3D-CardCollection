"use client";
import React, { useEffect, useState } from "react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { CARD_CONTRACT_ADDRESS } from "../../../const/addresses";
import { client } from "../../client";
import { useActiveWallet } from "thirdweb/react";
import { defineChain, getContract } from "thirdweb";

const TrackPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ track: string }>;
  searchParams: Promise<{ image: string }>;
}) => {
  // Resolve Promises
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { image } = resolvedSearchParams;

  // Semi-circle radius
  const radius = 180;

  const [nfts, setNfts] = useState<any[]>([]);
  const walletInfo = useActiveWallet();
  const chain = defineChain(walletInfo?.getChain()?.id ?? 11155111);
  const walletAddress = walletInfo?.getAccount()?.address ?? "0x";

  const cardsContract = getContract({
    address: CARD_CONTRACT_ADDRESS,
    chain,
    client,
  });

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const fetchedNFTs = await getOwnedNFTs({
          contract: cardsContract,
          start: 0,
          count: 5, // Adjust number of NFTs as needed
          address: walletAddress,
        });
        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    if (walletAddress !== "0x") {
      fetchNFTs();
    }
  }, [walletAddress]);

  const formatIpfsUrl = (url: string) => {
    return url.replace(
      "ipfs://",
      "https://d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io/ipfs/"
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-between z-50"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Top Semi-Circle of Cards */}
      <div className="relative w-full h-36 flex justify-center items-center">
        {nfts.slice(0, 5).map((nft, index) => {
          const angle = (Math.PI / (nfts.length - 1)) * index; // Evenly space cards in semi-circle
          const x = radius * Math.cos(angle); // Calculate X position
          const y = radius * Math.sin(angle); // Calculate Y position

          return (
            <div
              key={index}
              className="absolute w-20 h-32 rounded-md border-2 border-white flex items-center justify-center text-center text-white font-bold text-xs"
              style={{
                backgroundImage: `url(${formatIpfsUrl(
                  nft.metadata.image
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <h1 className="font-mono">{nft.metadata.name}</h1>
            </div>
          );
        })}
      </div>

      {/* Bottom Semi-Circle of Cards */}
      <div className="relative w-full h-32 flex justify-center items-center bottom-0">
        {nfts.slice(5).map((nft, index) => {
          const angle = (Math.PI / (nfts.length - 1)) * index; // Evenly space cards in semi-circle
          const x = radius * Math.cos(angle); // Calculate X position
          const y = -radius * Math.sin(angle); // Calculate Y position

          return (
            <div
              key={index}
              className="absolute w-20 h-36 rounded-md border-2 border-white flex items-center justify-center text-center text-white font-bold text-xs"
              style={{
                backgroundImage: `url(${formatIpfsUrl(
                  nft.metadata.image
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <h1 className="font-mono">{nft.metadata.name}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackPage;
