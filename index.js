const solana = require('@solana/web3.js');

const newPair = new solana.Keypair();
const publicKey = new solana.PublicKey(newPair._keypair.publicKey).toString();
const secretKey = newPair._keypair.secretKey;

const getWalletBalance = async () => {
    try {
        const connection = new solana.Connection(solana.clusterApiUrl('devnet'), 'confirmed');

        const myWallet = await solana.Keypair.fromSecretKey(secretKey);
        const walletBalance = await connection.getBalance(new solana.PublicKey(myWallet.publicKey));

        console.log(`=> For wallet address ${publicKey}`);
        console.log(`   Wallet balance: ${parseInt(walletBalance)/solana.LAMPORTS_PER_SOL}SOL`);
    } catch(err) {
        console.log(err);
    }
};

const airDropSOL = async () => {
    try {
        const connection = new solana.Connection(solana.clusterApiUrl('devnet'), 'confirmed');
        const walletKeyPair = await solana.Keypair.fromSecretKey(secretKey);

        const fromAirDropSignature = await connection.requestAirdrop(
            new solana.PublicKey(walletKeyPair.publicKey),
            2 * solana.LAMPORTS_PER_SOL,
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err)
    }
};

const driverFunction = async () => {
    await getWalletBalance();
    await airDropSOL();
    await getWalletBalance();
};

driverFunction();