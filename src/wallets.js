/* eslint-disable */
import algosdk from "algosdk";

const sendAlgoSignerTransaction = async (sdkTx, client) => {

    console.log("sdKtx", sdkTx);
    

    if (typeof AlgoSigner !== "undefined") {

        try {

            let binaryTxs = sdkTx.map(item => item.toByte());

            let base64Txs = binaryTxs.map((binary) => AlgoSigner.encoding.msgpackToBase64(binary));

            let signers = [];

            signers = base64Txs.map(item => ({ txn: item }));

            let signedTxs = await AlgoSigner.signTxn(signers);

            let binarySignedTxs = signedTxs.map((tx) => AlgoSigner.encoding.base64ToMsgpack(tx.blob));


            return await client.sendRawTransaction(binarySignedTxs).do();
        }
        catch (err) {
            console.log("🚀 ~ file: wallets.js ~ line 22 ~ sendAlgoSignerTransaction ~ err", err)
        }
    }

};

export default {
    sendAlgoSignerTransaction
};
