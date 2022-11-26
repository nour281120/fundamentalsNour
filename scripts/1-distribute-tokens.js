const { executeTransaction } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run(runtimeEnv, deployer) {

    const master = deployer.accountsByName.get("master");
   
    const tokenDef = {
        total: 100000,
        decimals: 0,
        defaultFrozen: false,
        unitName: "roxy",
        url: "url",
        note: "rox coin",
        manager:"",
        reserve: "",
        freeze: "",
        clawback:""
    };

    const createToken = await deployer.deployASADef('tokenDef9', tokenDef,{
        creator: deployer.accountsByName.get("master"),
        totalFee: 1000,
        validRounds: 1002
    });    

    const assetId = createToken.assetIndex;

    // provide buyer with algos 
    const receiver = deployer.accountsByName.get("buyer");
    console.log(receiver)
    await executeTransaction(deployer, {
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        toAccountAddr: receiver.addr,
        amountMicroAlgos: 200000,
        payFlags: { totalFee: 1000 },
    });

    // asset opt in
    await executeTransaction(deployer, {
        type: types.TransactionType.OptInASA,
        sign: types.SignType.SecretKey,
        fromAccount: receiver,
        assetID: assetId,
        payFlags: { totalFee: 1000 },
    });

    // transfer asset
    await executeTransaction(deployer, {
        type: types.TransactionType.TransferAsset,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        toAccountAddr: receiver.addr,
        amount: 100,
        assetID: assetId,
        payFlags: { totalFee: 1000 },
    });

    const receiverAcc = await deployer.algodClient.accountInformation(receiver.addr).do();
    console.log(receiverAcc.assets);
   
    
}

module.exports = { default: run };