import * as anchor from '@coral-xyz/anchor'
import { Program, Wallet } from '@coral-xyz/anchor'
import { PdaAccounts } from './pdaAccounts'
import { ProgramService } from './progromService'
import BN from 'bn.js'
import { Connection, PublicKey } from '@solana/web3.js'
import _ from 'lodash'
import { EarthDto } from './models/earthDto.js'
import { PostDto } from './models/postDto.js'
import { ReplyDto } from './models/replyDto.js'
import { UserDto } from './models/userDto.js'
import { Solaforum } from './types/solaforum'

export class ForumService {
    connection: Connection
    program: Program<Solaforum>
    pdaAccounts: PdaAccounts
    programService: ProgramService
    constructor(connection: Connection, program: Program<Solaforum>, pdaAccounts: PdaAccounts, programService: ProgramService) {
        this.connection = connection
        this.program = program
        this.pdaAccounts = pdaAccounts
        this.programService = programService
    }

    async initialize() {
        const initializeTrxHash = await this.programService.initialize()
        console.log(`run initialize Trx: ${initializeTrxHash}`)
        return initializeTrxHash
    }

    async initializeUser(user: PublicKey, name: string) {
        const initializeUserTrxHash = await this.programService.initializeUser(user, name)
        console.log(`run initializeUser Trx: ${initializeUserTrxHash}`)
        return initializeUserTrxHash
    }

    async createEarth(user: PublicKey, earthId: number, name: string) {
        if (anchor.utils.bytes.utf8.encode(name).length > 30) {
            throw new Error('Earth name too long! Max allowed is 30 bytes utf-8 string')
        }

        const _earthId = new BN(earthId)

        /**
         * Create Earth
         */
        const createEarthTrxHash = await this.programService.createEarth(user, _earthId, name)
        console.log(`run createEarth Trx: ${createEarthTrxHash}`)

        const earth = await this.programService.queryEarth(_earthId)
        console.log(`earth: ${JSON.stringify(earth)}`)
        return {
            trxHash: createEarthTrxHash,
            earthId: earth.id,
        }
    }

    async createPost(user: PublicKey, userPostId: number, earthId: number, title: string, content: string) {
        if (anchor.utils.bytes.utf8.encode(title).length > 50) {
            throw new Error('Post title too long! Max allowed is 50 bytes utf-8 string')
        }
        if (anchor.utils.bytes.utf8.encode(content).length > 255) {
            throw new Error('Post content too long! Max allowed is 255 bytes utf-8 string')
        }

        const _userPostId = new BN(userPostId)
        const _earthId = new BN(earthId)

        console.log(user.toString(), _userPostId.toNumber(), _earthId.toNumber(), title, content)
        /**
         * Create Post
         */
        const createPostTrxHash = await this.programService.createPost(user, _userPostId, _earthId, title, content)
        console.log(`run createPost Trx: ${createPostTrxHash}`)

        const post = await this.programService.queryPost(user, _userPostId)
        console.log(`post: ${JSON.stringify(post)}`)
        return {
            trxHash: createPostTrxHash,
            postId: post.id,
        }
    }

    async createReply(user: PublicKey, postCreator: PublicKey, userPostId: number, content: string) {
        if (anchor.utils.bytes.utf8.encode(content).length > 255) {
            throw new Error('Reply content too long! Max allowed is 255 bytes utf-8 string')
        }

        const _userPostId = new BN(userPostId)
        /**
         * Create Reply
         */
        const createReplyTrxHash = await this.programService.createReply(user, postCreator, _userPostId, content)
        console.log(`run createReply Trx: ${createReplyTrxHash}`)

        // const reply = await this.programService.queryReply(new BN(earthId), new BN(postId), replyId)
        // console.log(`reply: ${JSON.stringify(reply)}`)
        return {
            trxHash: createReplyTrxHash,
            // replyId: reply.id,
        }
    }

    async getUser(user: PublicKey): Promise<UserDto> {
        const userAccount = await this.programService.queryUser(user)
        return {
            name: userAccount.name,
            userPostNextId: new BN(userAccount.userPostNextId).toNumber(),
        }
    }

    async getEarth(earthId: number): Promise<EarthDto> {
        const earth = await this.programService.queryEarth(new BN(earthId))
        return {
            id: new BN(earth.id).toNumber(),
            name: earth.name,
            creator: earth.creator,
            earthPostNextId: new BN(earth.earthPostNextId).toNumber(),
        }
    }

    async getEarthPosts(earthId: number): Promise<PostDto[]> {
        const _earthId = new BN(earthId)
        // const earth = await this.programService.queryEarth(_earthId);
        const earthAccount = this.pdaAccounts.earth(_earthId)[0]

        const touchSignatures = await this.connection.getSignaturesForAddress(earthAccount)
        const trxs = await this.connection.getTransactions(
            touchSignatures.map((_) => _.signature),
            { maxSupportedTransactionVersion: 0 },
        )

        const postTrxs: anchor.web3.VersionedTransactionResponse[] = trxs.filter(
            (trx) => trx && !!trx?.meta?.logMessages?.find((log) => log === 'Program log: Created Post.'),
        ) as anchor.web3.VersionedTransactionResponse[]

        const postDtos: PostDto[] = []
        for (let postTrx of postTrxs) {
            const creator = new PublicKey(this.extractFieldFromLog(postTrx, 'Creator: '))
            const userPostId = new BN(this.extractFieldFromLog(postTrx, 'User Post ID: '))

            console.log(creator.toString(), userPostId.toNumber())
            const post = await this.programService.queryPost(creator, userPostId)
            const creatorAccount = await this.programService.queryUser(creator)

            const postDto = {
                creator,
                creatorName: creatorAccount.name,
                id: new BN(userPostId).toNumber(),
                replyNextId: new BN(post.replyNextId).toNumber(),
                createdTime: +(post.createdTime + '000') ?? 0,
                lastReplyTime: +(post.lastReplyTime + '000') ?? 0,
                title: this.extractFieldFromLog(postTrx, 'Post title: '),
                content: this.extractFieldFromLog(postTrx, 'Post content: '),
            }
            postDtos.push(postDto)
        }
        return postDtos
    }

    async getPost(creator: PublicKey, userPostId: number): Promise<PostDto> {
        const _userPostId = new BN(userPostId)
        const creatorAccount = await this.programService.queryUser(creator)
        const post = await this.programService.queryPost(creator, _userPostId)

        const postPda = await this.pdaAccounts.post(creator, _userPostId)[0]

        const touchSignatures = await this.connection.getSignaturesForAddress(postPda)
        const createPostSignature = touchSignatures[touchSignatures.length - 1]

        const createPostTrx = await this.connection.getTransaction(createPostSignature.signature, { maxSupportedTransactionVersion: 0 })

        if (!createPostTrx) {
            throw new Error('Post not found')
        }

        const postDto = {
            creator,
            creatorName: creatorAccount.name,
            id: new BN(userPostId).toNumber(),
            replyNextId: new BN(post.replyNextId).toNumber(),
            createdTime: +(post.createdTime + '000') ?? 0,
            lastReplyTime: +(post.lastReplyTime + '000') ?? 0,
            title: this.extractFieldFromLog(createPostTrx, 'Post title: '),
            content: this.extractFieldFromLog(createPostTrx, 'Post content: '),
        }

        return postDto
    }

    async getPostReplys(creator: PublicKey, userPostId: number, startFromReplyHash: string | null): Promise<ReplyDto[]> {
        const _userPostId = new BN(userPostId)
        const postAccount = this.pdaAccounts.post(creator, _userPostId)[0]

        const touchSignatures = (
            await this.connection.getSignaturesForAddress(postAccount, startFromReplyHash ? { until: startFromReplyHash } : undefined)
        ).reverse()
        const trxs = await this.connection.getTransactions(
            touchSignatures.map((_) => _.signature),
            { maxSupportedTransactionVersion: 0 },
        )

        const replyTrxs: anchor.web3.VersionedTransactionResponse[] = trxs.filter(
            (trx) => trx && !!trx?.meta?.logMessages?.find((log) => log === 'Program log: Created Post Reply.'),
        ) as anchor.web3.VersionedTransactionResponse[]

        const replyDtos: ReplyDto[] = []
        for (let replyTrx of replyTrxs) {
            const author = new PublicKey(this.extractFieldFromLog(replyTrx, 'Reply user: '))
            const authorAccount = await this.programService.queryUser(author)

            const replyDto = {
                id: +this.extractFieldFromLog(replyTrx, 'Reply ID: '),
                author,
                authorName: authorAccount.name,
                createdTime: (replyTrx.blockTime && +(replyTrx.blockTime + '000')) ?? 0,
                content: this.extractFieldFromLog(replyTrx, 'Reply content: '),
                _trxHash: replyTrx.transaction.signatures[0],
            }
            console.log('replyTrx.transaction: ', replyTrx.transaction)
            replyDtos.push(replyDto)
        }

        return replyDtos
    }

    extractFieldFromLog(trx: anchor.web3.VersionedTransactionResponse, prefixMessage: string): string {
        return (
            trx?.meta?.logMessages
                ?.find((log: string) => log.startsWith('Program log: ' + prefixMessage))
                ?.replace('Program log: ' + prefixMessage, '') ?? ''
        )
    }

    async checkUserInitialized(user: PublicKey) {
        try {
            const userAccount = await this.programService.queryUser(user)
            console.log('userAccount', userAccount)
            return true
        } catch (e: any) {
            if (e?.message?.startsWith('Account does not exist or has no data')) {
                return false
            } else {
                throw e
            }
        }
    }
}
