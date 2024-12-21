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

import { motion, AnimatePresence } from "framer-motion";
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
    return url.replace(
      "ipfs://",
      "https://d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io/ipfs/"
    );
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

  const renderMedia = (url: string, alt: string) => {
    if (url.endsWith(".glb") || url.endsWith(".gltf")) {
      return (
        <model-viewer
          src={formatIpfsUrl(url)}
          alt={alt}
          className="w-full h-full object-cover rounded-lg shadow-lg"
          auto-rotate
          camera-controls
          style={{ width: "100%", height: "100%" }}
        ></model-viewer>
      );
    }
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
          3D Car NFT Marketplace
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
                  className="bg-transparent rounded-lg shadow-md overflow-hidden flex flex-col w-72 h-[400px] cursor-pointer"
                  onClick={() => handleCardClick(nft)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative h-80 w-full">
                    {renderMedia(nft.metadata.image, nft.metadata.name)}
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
                  className="bg-black border border-red-600 rounded-lg shadow-lg overflow-hidden flex flex-col h-full w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative h-80 w-full">
                    {renderMedia(pack.metadata.image, pack.metadata.name)}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h2 className="text-xl font-medieval mb-2 text-white">
                      {pack.metadata.name}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 h-10 overflow-y-auto font-medieval">
                      {pack.metadata.description}
                    </p>
                    <div className="flex justify-between items-center text-gray-300 mb-4">
                      <span className="font-medieval">
                        Amount Owned: <b className="text-white">{pack.quantityOwned.toString()}</b> /{" "}
                        <b className="text-white">{pack.supply.toString()}</b>
                      </span>
                    </div>
                    <button
                      onClick={openNewPack.bind(null, pack.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 font-medieval"
                    >
                      Open Pack
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedNft && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-2xl p-8 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-4xl relative"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 font-bold text-2xl"
                >
                  ✕
                </button>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
                    {renderMedia(selectedNft.metadata.image, selectedNft.metadata.name)}
                  </div>
                  <div className="flex-grow text-white font-medieval">
                    <h2 className="text-4xl font-bold mb-4">
                      {selectedNft.metadata.name}
                    </h2>

                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2">
                        Attributes:
                      </h3>
                      <ul className="grid grid-cols-2 gap-4">
                        {selectedNft.metadata.attributes.map(
                          (attribute, index) => (
                            <li
                              key={index}
                              className="bg-white bg-opacity-10 rounded-md p-3"
                            >
                              <span className="font-bold">
                                {attribute.trait_type}:
                              </span>{" "}
                              {attribute.value}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <p className="text-2xl">
                      Owned: {selectedNft.quantityOwned.toString()} /{" "}
                      {selectedNft.supply.toString()}
                    </p>
                    <p className="text-xl mb-6">
                      {selectedNft.metadata.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
