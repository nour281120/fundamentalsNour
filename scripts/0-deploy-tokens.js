
async function run(runtimeEnv, deployer) {

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

    await deployer.deployASADef('roxcop', tokenDef,{
        creator: deployer.accountsByName.get("master"),
        totalFee: 1000,
        validRounds: 1002
    });    
}

module.exports = { default: run };

// ! I tried to create fungible token and transfer it to buyer in the same file 1-distribute-tokens.