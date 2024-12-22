"use client";

import React, { useEffect, useState } from "react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { CARD_CONTRACT_ADDRESS } from "../../../const/addresses";
import { client } from "../../client";
import { useActiveWallet } from "thirdweb/react";
import { defineChain, getContract } from "thirdweb";

const TrackPage = ({
  params,
  searchParams,
}: {
  params: { track: string };
  searchParams: { image: string };
}) => {
  const { image } = searchParams;

  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [aiSelectedCard, setAiSelectedCard] = useState<any>(null);
  const [rounds, setRounds] = useState<number>(0);
  const [userWins, setUserWins] = useState<number>(0);
  const [aiWins, setAiWins] = useState<number>(0);
  const [overallWinner, setOverallWinner] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // List of attributes to be compared
  const attributes = ["Torque", "TopSpeed", "Acceleration", "HorsePower"];
  const [currentAttributeIndex, setCurrentAttributeIndex] = useState(0);
  const currentAttribute = attributes[currentAttributeIndex];

  const walletInfo = useActiveWallet();
  const chain = defineChain(walletInfo?.getChain()?.id ?? 11155111);
  const walletAddress = walletInfo?.getAccount()?.address ?? "0x";

  const cardsContract = getContract({
    address: CARD_CONTRACT_ADDRESS.toString(),
    chain,
    client,
  });

  const randint = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const fetchedNFTs = await getOwnedNFTs({
          contract: cardsContract,
          start: 0,
          count: 5,
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

  const handleCardClick = (nft: any) => {
    if (!selectedCard) {
      setSelectedCard(nft);
      setGameResult(null);
    }
  };

  const confirmChoice = () => {
    if (selectedCard && rounds <= 5 && !overallWinner) {
      const randomAiCard = nfts[randint(0, nfts.length - 1)];
      setAiSelectedCard(randomAiCard);

      const userAttributeValue =
        selectedCard.metadata?.attributes?.[currentAttribute] ||
        Math.floor(Math.random() * 100) + 1;
      const aiAttributeValue =
        randomAiCard.metadata?.attributes?.[currentAttribute] ||
        Math.floor(Math.random() * 100) + 1;

      if (userAttributeValue > aiAttributeValue) {
        setUserWins((prev) => prev + 1);
        setGameResult(
          `You win this round! (${selectedCard.metadata.name} vs ${randomAiCard.metadata.name})`
        );
      } else if (userAttributeValue < aiAttributeValue) {
        setAiWins((prev) => prev + 1);
        setGameResult(
          `AI wins this round! (${randomAiCard.metadata.name} vs ${selectedCard.metadata.name})`
        );
      } else {
        setUserWins((prev) => prev + 0.5);
        setAiWins((prev) => prev + 0.5);
        setGameResult(
          `It's a draw! (${selectedCard.metadata.name} vs ${randomAiCard.metadata.name})`
        );
      }

      if (rounds === 5) {
        const winner =
          userWins > aiWins
            ? "You"
            : aiWins > userWins
            ? "AI"
            : "It's a draw!";
        setOverallWinner(winner);
      }

      setRounds((prev) => prev + 1);
      setSelectedCard(null);
      setAiSelectedCard(null);

      // Cycle to the next attribute
      setCurrentAttributeIndex((prevIndex) => (prevIndex + 1) % attributes.length);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-between items-center relative z-50"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="bg-transparent flex items-center justify-center flex-col mt-4 text-white">
        <h1 className="special-font hero-heading text-red-800 mb-6 !text-6xl">
          Results
        </h1>

        <h2 className="text-4xl mb-4">Comparing by: {currentAttribute}</h2>

        <div className="font-semibold">
          <p>Round: {rounds} / 5</p>
          <p>Your Wins: {userWins}</p>
          <p>AI Wins: {aiWins}</p>
        </div>

        <button
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md"
          onClick={confirmChoice}
          disabled={!selectedCard || overallWinner !== null}
        >
          Confirm Choice
        </button>

        {gameResult && (
          <div className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md text-center">
            <p>{gameResult}</p>
          </div>
        )}
        {overallWinner && (
          <div className="mt-4 bg-green-800 text-white px-4 py-2 rounded-md text-center">
            <p>{overallWinner} is the overall winner!</p>
          </div>
        )}
      </div>

      <div className="flex justify-between w-full px-8 mt-10">
        <div className="flex flex-col items-center">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-20 h-32 mb-4 rounded-md border-2 border-gray-500 flex items-center justify-center text-center text-gray-500 font-bold text-xs"
              >
                <h1 className="font-mono">Blank Card</h1>
              </div>
            ))}
        </div>

        <div className="flex flex-col items-center">
          {nfts.slice(0, 5).map((nft, index) => (
            <div
              key={index}
              className={`w-20 h-32 mb-4 rounded-md border-2 ${
                selectedCard === nft ? "border-green-500" : "border-white"
              } flex items-center justify-center text-center text-white font-bold text-xs cursor-pointer`}
              style={{
                backgroundImage: `url(${formatIpfsUrl(nft.metadata.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => handleCardClick(nft)}
            >
              <h1 className="font-mono">{nft.metadata.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
