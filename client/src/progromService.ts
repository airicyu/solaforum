import * as anchor from '@coral-xyz/anchor'
import { PdaAccounts } from './pdaAccounts.js'
import { Keypair, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import type { Solaforum } from './types/solaforum'

export class ProgramService {
    program: anchor.Program<Solaforum>
    pdaAccounts: PdaAccounts

    constructor(program: anchor.Program<Solaforum>, pdaAccounts: PdaAccounts) {
        this.program = program
        this.pdaAccounts = pdaAccounts
    }

    initialize = async () => {
        const trxHash = await this.program.methods
            .initialize()
            .accounts({
                earthIdCounter: this.pdaAccounts.earthIdCounter()[0],
            })
            .rpc()
        return trxHash
    }

    createEarth = async (user: PublicKey, earthId: BN, name: string) => {
        const trxHash = await this.program.methods
            .createEarth({
                earthId,
                name,
            })
            .accounts({
                earthIdCounter: this.pdaAccounts.earthIdCounter()[0],
                earth: this.pdaAccounts.earth(earthId)[0],
            })
            .rpc()
        return trxHash
    }

    initializeUser = async (user: PublicKey, name: string) => {
        const trxHash = await this.program.methods
            .initializeUser({
                name,
            })
            .accounts({
                user: this.pdaAccounts.user(user)[0],
            })
            .rpc()
        return trxHash
    }

    createPost = async (user: PublicKey, userPostId: BN, earthId: BN, title: string, content: string) => {
        const trxHash = await this.program.methods
            .createPost({
                earthId: earthId,
                title,
                content,
            })
            .accounts({
                earth: this.pdaAccounts.earth(earthId)[0],
                creator: this.pdaAccounts.user(user)[0],
                post: this.pdaAccounts.post(user, userPostId)[0],
            })
            .rpc()
        return trxHash
    }

    createReply = async (user: PublicKey, postCreator: PublicKey, userPostId: BN, content: string) => {
        const trxHash = await this.program.methods
            .createReply({
                postCreator,
                userPostId,
                content,
            })
            .accounts({
                post: this.pdaAccounts.post(postCreator, userPostId)[0],
            })
            .rpc()
        return trxHash
    }

    queryEarthIdCounter = async () => {
        return this.program.account.u64IdCounter.fetch(this.pdaAccounts.earthIdCounter()[0])
    }

    queryEarth = async (earthId: BN) => {
        return this.program.account.earth.fetch(this.pdaAccounts.earth(earthId)[0])
    }

    queryUser = async (user: PublicKey) => {
        return this.program.account.user.fetch(this.pdaAccounts.user(user)[0])
    }

    queryPost = async (postCreator: PublicKey, userPostId: BN) => {
        return this.program.account.post.fetch(this.pdaAccounts.post(postCreator, userPostId)[0])
    }
}
