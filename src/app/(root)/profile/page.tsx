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
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [activeTab, setActiveTab] = useState("NFTs");

  const walletInfo = useActiveWallet();
  const chain = defineChain(walletInfo?.getChain()?.id ?? 11155111);
  const walletAddress = walletInfo?.getAccount()?.address ?? "0x";
  const account = useActiveAccount();

  const cardsContract = getContract({
    address: CARD_CONTRACT_ADDRESS,
    chain,
    client,
  });

  const packsContract = getContract({
    address: PACK_CONTRACT_ADDRESS,
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
    return url.replace("ipfs://", "https://d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io/ipfs/");
  };

  const handleCardClick = (nft: NFT) => {
    setSelectedNft(nft);
  };

  const handleClose = () => {
    setSelectedNft(null);
  };

  const openNewPack = async (packId: number) => {
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
  };

  // Check if wallet is connected, if not, show the connect wallet message
  if (walletAddress === "0x") {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-black">
        <h1 className="text-4xl font-bold text-center">
          Please connect your wallet to view the profile and NFTs.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-16 pb-40 pt-20">
      <div className="flex flex-col items-center">
        <h1 className="special-font hero-heading text-red-800 mb-6 !text-6xl">
          Profile
        </h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("NFTs")}
            className={`px-4 py-2 rounded-lg font-medieval ${
              activeTab === "NFTs"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            NFTs
          </button>
          <button
            onClick={() => setActiveTab("Packs")}
            className={`px-4 py-2 rounded-lg font-medieval ${
              activeTab === "Packs"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Packs
          </button>
        </div>
      </div>
      {activeTab === "NFTs" &&
        (isLoading ? (
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
                className="border-t-4 border-red-500 rounded-full w-16 h-16"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
            <h1 className="text-3xl font-bold mb-8 text-center font-medieval">
              Loading Lists ...
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {nfts.map((nft, index) => (
              <motion.div
                key={index}
                className="bg-transparent rounded-lg shadow-md overflow-hidden flex flex-col w-72 h-[300px] cursor-pointer border-red-700 border-2"
                onClick={() => handleCardClick(nft)}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={formatIpfsUrl(nft.metadata.image)}
                    alt={nft.metadata.name}
                    width={288}
                    height={320}
                    className="object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-2 min-w-60">
                  <p
                    className="text-md mb-6 overflow-hidden text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {nft.metadata.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ))}

      {activeTab === "Packs" && (
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4">
            {packs.map((pack, index) => (
              <motion.div
                key={index}
                className="bg-black text-white font-semibold rounded-lg shadow-md overflow-hidden flex flex-col h-full w-full"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={formatIpfsUrl(pack.metadata.image)}
                    alt={pack.metadata.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h2 className="text-xl font-medieval mb-2 text-black">
                    {pack.metadata.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 h-10 overflow-y-auto font-medieval">
                    {pack.metadata.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700 font-medieval">
                      Amount Owned: {pack.quantityOwned.toString()} /{" "}
                      {pack.supply.toString()}
                    </span>
                  </div>
                  <button
                    onClick={openNewPack.bind(null, pack.id)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200 font-medieval"
                  >
                    Open Pack
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
