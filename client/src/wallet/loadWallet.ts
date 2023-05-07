import { Keypair } from '@solana/web3.js'

//8kChC4Fr7D7nQpRXJ9HkRYSLHbKFTF6Jb2hD5AEfE6KP
const privateKey = Uint8Array.from(
    [
        57, 42, 26, 154, 58, 96, 166, 179, 30, 88, 246, 175, 168, 180, 209, 148, 145, 242, 178, 70, 220, 202, 173, 155, 234, 238, 124, 231, 178, 235,
        213, 163, 115, 19, 1, 40, 159, 136, 244, 118, 8, 16, 186, 202, 49, 6, 9, 224, 239, 0, 17, 213, 127, 185, 92, 26, 89, 48, 78, 80, 253, 24, 165,
        166,
    ].slice(0, 32),
)

const wallet = Keypair.fromSeed(privateKey)

// const wallet = Keypair.generate()

/**
 * Providing payer wallet
 */
export { wallet }
