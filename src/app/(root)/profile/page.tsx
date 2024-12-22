"use client";

import { useEffect, useState } from "react";
import { useActiveWallet } from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  CARD_CONTRACT_ADDRESS,
  PACK_CONTRACT_ADDRESS,
} from "../../../const/addresses";
import { defineChain, getContract, sendTransaction } from "thirdweb";
import Image from "next/image";

import { client } from "../../client";

import { motion } from "framer-motion";
import { openPack } from "thirdweb/extensions/pack";
import { useActiveAccount } from "thirdweb/react";

// Define a type for the NFT metadata structure
type NFT = {
  metadata: {
    image: string;
    name: string;
    description: string;
    attributes: {
      trait_type: string;
      value: string | number;
    }[];
  };
  quantityOwned: string;
  supply: string;
};

export default function Profile() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [packs, setPacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("NFTs");

  const walletInfo = useActiveWallet();
  const chain = defineChain(walletInfo?.getChain()?.id ?? 11155111);
  const walletAddress = walletInfo?.getAccount()?.address ?? "0x";
  const account = useActiveAccount();

  const cardsContract = getContract({
    address: PACK_CONTRACT_ADDRESS,
    chain,
    client,
  });

  const packsContract = getContract({
    address: CARD_CONTRACT_ADDRESS,
    chain,
    client,
  });

  useEffect(() => {
    if (walletAddress !== "0x") {
      const fetchNfts = async () => {
        try {
          const fetchedNFTs = await getOwnedNFTs({
            contract: cardsContract,
            start: 0,
            count: 10,
            address: walletAddress,
          });
          const fetchedPacks = await getOwnedNFTs({
            contract: packsContract,
            start: 0,
            count: 10,
            address: walletAddress,
          });
          setNfts(fetchedNFTs);
          setPacks(fetchedPacks);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNfts();
    }
  }, [walletAddress]);

  const formatIpfsUrl = (url: string) => {
    return url.replace(
      "ipfs://",
      "https://d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io/ipfs/"
    );
  };  

  const openNewPack = async (packId: number) => {
  try {
    const transaction = await openPack({
      contract: packsContract,
      packId: BigInt(packId),
      amountToOpen: BigInt(1),
      overrides: {},
    });

    if (!account) {
      console.error("Account not found");
      return;
    }

    await sendTransaction({
      transaction,
      account: account,
    });

    alert("Pack opened successfully!");
  } catch (error) {
    console.error("Error opening pack:", error);
    alert(`Failed to open pack.Error: ${error}`);
  }
};


  const renderMedia = (url: string, alt: string) => {
    return (
      <Image
        src={formatIpfsUrl(url)}
        alt={alt}
        width={288}
        height={320}
        className="object-cover rounded-lg shadow-lg"
      />
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-16 pb-40 pt-20">
      <div className="flex flex-col items-center">
        <h1 className="special-font hero-heading text-red-800 mb-6 !text-6xl">
          NFT Marketplace
        </h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("Packs")}
            className={`px-4 py-2 rounded-lg font-medieval ${
              activeTab === "Packs"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            NFTs
          </button>
          <button
            onClick={() => setActiveTab("NFTs")}
            className={`px-4 py-2 rounded-lg font-medieval ${
              activeTab === "NFTs"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Packs
          </button>
        </div>

        {activeTab === "NFTs" &&
          (isLoading ? (
            <div className="text-center">
              <motion.div
                className="flex justify-center items-center h-64"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="border-t-4 border-red-500 rounded-full w-16 h-16"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                />
              </motion.div>
              <h1 className="text-3xl font-bold text-center font-medieval">
                Loading Lists...
              </h1>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {nfts.map((nft, index) => (
                <motion.div
                  key={index}
                  className="bg-transparent rounded-lg shadow-md overflow-hidden flex flex-col w-72 h-[400px] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {" "}
                  <div className="relative h-80 w-full">
                    {" "}
                    {renderMedia(nft.metadata.image, nft.metadata.name)}{" "}
                  </div>{" "}
                  <h2 className="text-xl mt-2">{nft.metadata.name}</h2>{" "}
                  <button
                    onClick={() => openNewPack(nft.metadata.id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    {" "}
                    Open Pack{" "}
                  </button>{" "}
                </motion.div>
              ))}
            </div>
          ))}

        {activeTab === "Packs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {packs.map((pack, index) => (
              <motion.div
                key={index}
                className="bg-black border border-red-600 rounded-lg shadow-lg flex flex-col p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative mb-10">
                  {renderMedia(pack.metadata.image, pack.metadata.name)}
                </div>
                <div className="max-w-64">
                  <p
                    className="text-md mb-6 overflow-hidden text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {pack.metadata.description}
                  </p>
                </div>
                <h2 className="text-xl mt-2">{pack.metadata.name}</h2>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
