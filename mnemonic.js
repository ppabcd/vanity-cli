const { generateMnemonic, EthHdWallet } = require('eth-hd-wallet')
const {isValidVanityAddress, toChecksumAddress} = require('./vanity.js');
const fs = require('fs');

let input = '00000000';
let minLength = 2;

let mnemonic = generateMnemonic()
let attempts = 0;
let addr = '';
for(;;){
    const wallet = EthHdWallet.fromMnemonic(mnemonic)
    wallet.generateAddresses(1)
    for(let j = 0; j < input.length-minLength; j++) {
        addr = wallet.getAddresses()[0].replace('0x', '')
        if(isValidVanityAddress(addr, input.substr(0, input.length-j), false, false)){
            fs.appendFileSync(
                'walletMN'+input.substr(0, input.length-j)+'.txt', 
                "Address: 0x"+ toChecksumAddress(addr) + '\n' + 
                "Private Key: "+ wallet.getPrivateKey(wallet.getAddresses()[0]).toString('hex') + '\n' +  
                "Mnemonic: "+ mnemonic + '\n\n');
            console.log(`Found  0x${toChecksumAddress(addr)} after ${attempts} attempts`);
            attempts = 0;
            break;
        }
    }
    // console.log(wallet.getAddresses()[0])
    mnemonic = generateMnemonic()
    attempts++
}