import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { BN } from '@coral-xyz/anchor'
import { Buffer } from 'buffer'
import { Solaforum } from './types/solaforum'

const fromU64 = (data: BN): Buffer => {
    return data.toArrayLike(Buffer, 'le', 8)
}

export class PdaAccounts {
    program: anchor.Program<Solaforum>
    constructor(program: anchor.Program<Solaforum>) {
        this.program = program
    }

    earthIdCounter() {
        return PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode('earth_id_counter')], this.program.programId)
    }

    earth(earthId: BN) {
        return PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode('earth'), fromU64(earthId)], this.program.programId)
    }

    user(user: PublicKey) {
        return PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode('user'), user.toBuffer()], this.program.programId)
    }

    post(user: PublicKey, userPostId: BN) {
        return PublicKey.findProgramAddressSync(
            [anchor.utils.bytes.utf8.encode('user_post'), user.toBuffer(), fromU64(userPostId)],
            this.program.programId,
        )
    }
}
