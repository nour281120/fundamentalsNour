// Credit - https://github.com/emg110/arc3ipfs

/**
 * Includes functions to convert between IPFS CID version 0 (Base58), and a 32 bytes hex string
 * Javascript module for NodeJS and JS frameworks enviroments.
 */

const bs58 = require("bs58");

const convertIpfsCidV0ToByte32 = (cid) => {
    const bytes = bs58.decode(cid).slice(2);
    const base64 = Buffer.from(bytes).toString("base64");
    const buffer = Buffer.from(base64, "base64");

    return { base64, buffer };
};

/**
 * Converts 32 byte hex string (initial 0x is removed) to Base58 IPFS content identifier version 0 address string (starts with Qm)
 * @param str - The 32 byte long hex string to encode to IPFS CID V0 (without initial 0x).
 * @returns string 
 */
const convertByte32ToIpfsCidV0 = (str) => {
    if (str.indexOf("0x") === 0) {
        str = str.slice(2);
    }
    return bs58.encode(Buffer.from(`1220${str}`, "hex"));
};



module.exports = { convertIpfsCidV0ToByte32, convertByte32ToIpfsCidV0 };
