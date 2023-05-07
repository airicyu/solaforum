import web3, { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { wallet } from './wallet/loadWallet.js'
import { sleepMs } from './utils.js'
import { Solaforum } from './types/solaforum.js'
import { PdaAccounts } from './pdaAccounts.js'
import { ProgramService } from './progromService.js'
import { idl } from './idl.js'
// import { BN } from 'bn.js'
import BN from 'bn.js'
import { ForumService } from './forumService.js'

const PROGRAM_ID = '4HeVTFdGHgSzjmexn7k1zpJxFsBymJ7FcpwJzGARvswN'

const user = new anchor.Wallet(wallet)

const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed')
const provider = new anchor.AnchorProvider(connection, user, {
    commitment: 'confirmed',
})
// anchor.setProvider(provider)
const program = new anchor.Program(idl as Solaforum, PROGRAM_ID, provider)
const pdaAccounts = new PdaAccounts(program)
const programService = new ProgramService(program, pdaAccounts)
const forumService = new ForumService(connection, program, pdaAccounts, programService)

const earthId = 1

// await forumService.initialize()
// await forumService.createEarth(user.publicKey, earthId, 'Earth1')
// await forumService.initializeUser(user.publicKey, 'TestUser1')

const earth = await forumService.getEarth(earthId)
const userAccount = await forumService.getUser(user.publicKey)

// const { trxHash, postId } = await forumService.createPost(
//     user.publicKey,
//     userAccount.userPostNextId,
//     earthId,
//     'hello world post',
//     'testing content\n Hello world!',
// )

const earthPosts = await forumService.getEarthPosts(earthId)

await forumService.createReply(user.publicKey, earthPosts[0].creator, earthPosts[0].id, 'hello GM!')

const post = await programService.queryPost(earthPosts[0].creator, new BN(earthPosts[0].id))

const postReplies = await forumService.getPostReplys(earthPosts[0].creator, earthPosts[0].id, null)

console.log()
