/* eslint-disable */
import algosdk from "algosdk";
import { getAlgodClient } from "./client.js";
import wallets from "./wallets.js";
import { convertByte32ToIpfsCidV0 } from "../scripts/helpers/ipfs2bytes32.js";
import { tx } from "@algo-builder/web";

const purchaseNFT = async (creator, receiver, nftId, fungibleTokenId, network) => {

    console.log(fungibleTokenId)
    // ! all the three transactions we need to make a purchase
    const optIntxn = await nftOptIn(receiver, nftId, network);
    const payment_with_tokens = await transferToken(receiver, creator, fungibleTokenId, network, 5);
    const buyer_receive_nft = await transferNft(creator, receiver, nftId, network, 1);

    const txns = []
    if(optIntxn)
    {
    txns.push(optIntxn)
    }
    txns.push(payment_with_tokens)
    txns.push(buyer_receive_nft)
    
    console.log("🚀 ~ file: asa.js ~ line 16 ~ purchaseNFT ~ txns", txns)
    algosdk.assignGroupID(txns);

    return await wallets.sendAlgoSignerTransaction(txns,getAlgodClient(network))

    
}

const optInRecieve = async (receiverAddr, nftId, network) => {


    if (!(receiverAddr && nftId)) {
        console.error("error", receiverAddr, nftId);
        return;
    }

    const algodClient = getAlgodClient(network);

    const suggestedParams = await algodClient.getTransactionParams().do();

    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        receiverAddr,
        receiverAddr,
        undefined,
        undefined,
        0,
        undefined,
        nftId,
        suggestedParams
    );

    return txn;
};

const transferNft = async (creator, receiverAddr, nftId, network, amount) => {


    if (!(receiverAddr && nftId)) {
        console.error("error", receiverAddr, nftId);
        return;
    }

    const algodClient = getAlgodClient(network);

    const suggestedParams = await algodClient.getTransactionParams().do();

    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        creator,
        receiverAddr,
        undefined,
        undefined,
        amount,
        undefined,
        nftId,
        suggestedParams
    );
    console.log("🚀 ~ file: asa.js ~ line 72 ~ transferNft ~ txn", txn)

    return txn;
};

const transferToken = async (creator, receiverAddr, fungibleTokenId, network, amount) => {


    if (!(receiverAddr && fungibleTokenId)) {
        console.error("error", receiverAddr, fungibleTokenId);
        return;
    }

    const algodClient = getAlgodClient(network);
    const suggestedParams = await algodClient.getTransactionParams().do();

    let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        creator,
        receiverAddr,
        undefined,
        undefined,
        amount,
        undefined,
        fungibleTokenId,
        suggestedParams
    );
    console.log("🚀 ~ file: asa.js ~ line 97 ~ transferToken ~ txn", txn)

    return txn;
};


const nftOptIn = async (receiver, assetId, network) => {

    const receiverInfo = await getAccountInfo(
        receiver,
        network
    );
    const optedInAsset = receiverInfo.assets.find((asset) => {
        return asset["asset-id"] === assetId;
    });
    console.log("🚀 ~ file: asa.js ~ line 113 ~ optedInAsset ~ optedInAsset", optedInAsset)

   

    if(optedInAsset === undefined) 
    {
        const optInTxn = await optInRecieve(
            receiver,
            assetId,
            network
        );
       
    console.log("🚀 ~ file: asa.js ~ line 57 ~ nftOptIn ~ optedIn", optInTxn)
    return optInTxn;
    }

    else {
        return null;
    }
        
    
}

const getAccountInfo = async (address, network) => {
    const algodClient = getAlgodClient(network);

    return await algodClient.accountInformation(address).do();
};

const checkMetadataHash = (uint8ArrHash, assetURL) => {
    // convert uint8array to hex string
    let metadataHash = Buffer.from(uint8ArrHash).toString("hex");

    // get IPFS cid of json metadata 
    const cid = convertByte32ToIpfsCidV0(metadataHash);

    // check if cid from assetURL is the same as cid extracted from metadata hash
    let cid_from_assetURL = assetURL.replace("ipfs://", "");
    cid_from_assetURL = cid_from_assetURL.replace("#arc3", "");

    return cid_from_assetURL === cid;
}

export default {
    purchaseNFT,
    checkMetadataHash,
    getAccountInfo,
};