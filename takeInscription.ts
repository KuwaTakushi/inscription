import { ethers } from "ethers";

async function takeInscription(retryCount: number) {
  const privateKey = ""
  const rpcUrl = 'https://oktc-mainnet.public.blastapi.io';
  const network = 'mainnet';
  const provider = new ethers.JsonRpcProvider(rpcUrl, { name: network, chainId: 66 });
  const wallet = new ethers.Wallet(privateKey, provider);
  const toAddress = "" // Yourself
  const value = ethers.parseEther('0');
  const hexData = '0x646174613a2c7b2270223a227872632d3230222c226f70223a226d696e74222c227469636b223a226f6b7473222c22616d74223a2231303030227d'
  const gasPrice = (await provider.getFeeData()).gasPrice;
  

  async function sendTransaction() {
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
    const transaction: ethers.TransactionRequest = {
      to: toAddress,
      value: value,
      data: hexData,
      gasLimit: '50000',
      nonce: nonce,
      //gasPrice: ethers.parseUnits('15', 'gwei'),
      gasPrice: gasPrice,
    };

    const tx = await wallet.sendTransaction(transaction);
    await provider.waitForTransaction(tx.hash);

    return tx;
  }

  for (let i = 0; i < retryCount; i++) {
    try {
      const tx = await sendTransaction();
        const receipt = await provider.getTransactionReceipt(tx.hash);

        
        if (receipt && receipt.status === 1) {
        console.log(`[HASH]: ${tx.hash}     [MINT]: ${i + 1}/${retryCount}`);
        } else {
          console.log(`[HASH]: ${tx.hash}     [MINT]: FAILED`);
        }

     await new Promise(resolve => setTimeout(resolve, 1000)); 
    } catch (error){ console.log(error)}
  }
}

const takeAmount = 1000;
takeInscription(takeAmount);
