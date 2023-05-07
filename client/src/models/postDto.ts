import { PublicKey } from "@solana/web3.js";

export type PostDto = {
  creator: PublicKey;
  creatorName: string;
  id: number;
  replyNextId: number;
  createdTime: number;
  lastReplyTime: number;
  title: string;
  content: string;
};
