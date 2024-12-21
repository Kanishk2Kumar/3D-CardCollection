import {
  createThirdwebClient,
  getContract,
  sendAndConfirmTransaction,
} from "thirdweb";

import { config } from "dotenv";

import { privateKeyToAccount } from "thirdweb/wallets";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "thirdweb/extensions/erc1155";
import { createNewPack } from "thirdweb/extensions/pack";
import { sepolia } from "thirdweb/chains";

config();

const main = async () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
  }
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY is not set");
  }

  try {
    const EDITION_CONTRACT_ADDRESS =
      "0x01FC1aF2b35469669ADfF84FC6F85bB41798BB29";
    const PACK_CONTRACT_ADDRESS = "0x3B37d407196392D36A7AA5e218F6e6a6c7F1D33c";

    const chain = sepolia;

    // Initialize the client and the account
    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const account = privateKeyToAccount({
      client,
      privateKey: process.env.PRIVATE_KEY,
    });

    // Get the contracts

    const contractEdition = getContract({
      address: EDITION_CONTRACT_ADDRESS,
      chain,
      client,
    });

    const contractPack = getContract({
      address: PACK_CONTRACT_ADDRESS,
      chain,
      client,
    });

    // Check if the Account is approved

    const isApproved = await isApprovedForAll({
      contract: contractEdition,
      owner: account.address,
      operator: PACK_CONTRACT_ADDRESS,
    });
    console.log("Account is approved");

    if (!isApproved) {
      const transaction = setApprovalForAll({
        contract: contractEdition,
        operator: PACK_CONTRACT_ADDRESS,
        approved: true,
      });

      const approvalData = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      console.log(`Approval Transaction hash: ${approvalData.transactionHash}`);
    }

    // Create a new Pack of Cards

    const transactionPack = createNewPack({
      contract: contractPack,
      client,
      recipient: account.address,
      tokenOwner: account.address,
      packMetadata: {
        name: "Rare Pack (#1)",
        image:
          "https://d9e571038d3183668c5882bbc75bc9ae.ipfscdn.io/ipfs/bafybeiagetkkhokeluwkyllzqhd64ckuqxzwjcse7ayjrtcq4edwaaxvi4/",
        description: "Rare Car nfs Pack",
      },

      openStartTimestamp: new Date(),

      erc1155Rewards: [
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(0),
          quantityPerReward: 1,
          totalRewards: 25,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(1),
          quantityPerReward: 1,
          totalRewards: 10,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(2),
          quantityPerReward: 1,
          totalRewards: 20,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(3),
          quantityPerReward: 1,
          totalRewards: 10,
        },
        {
          contractAddress: EDITION_CONTRACT_ADDRESS,
          tokenId: BigInt(4),
          quantityPerReward: 1,
          totalRewards: 5,
        },
      ],

      amountDistributedPerOpen: BigInt(5),
    });

    const dataPack = await sendAndConfirmTransaction({
      transaction: transactionPack,
      account,
    });

    console.log(`Pack Transaction hash: ${dataPack.transactionHash}`);
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

main();
