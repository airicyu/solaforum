import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solaforum } from "../target/types/solaforum";

describe("solaforum", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solaforum as Program<Solaforum>;

  it("Is initialized!", async () => {
    const [earthIdCounterPDA, _] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("earth_id_counter")],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        earthIdCounter: earthIdCounterPDA,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
