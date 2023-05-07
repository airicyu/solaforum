import { PublicKey } from "@solana/web3.js";

export type ReplyDto = {
  id: number;
  author: PublicKey;
  authorName: string;
  createdTime: number;
  content: string;
  _trxHash: string;
};
