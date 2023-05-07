import { PublicKey } from "@solana/web3.js";

export type EarthDto = {
  creator: PublicKey;
  id: number;
  name: string;
  earthPostNextId: number;
};
