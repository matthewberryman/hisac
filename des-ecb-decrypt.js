const bent = require('bent');

const post = bent('https://api.hisac.computer/', 'POST', 'json', 200);

const main = async () => {

  // get the contents of the SWIFT file
  const SWIFT = (await post('command', {'func':'list','directory':'ARCHIVES/','args':['SWIFT']})).content;
  console.log(SWIFT); // looks like base64 encoded to me. Separate checks at cryptii.com indicate it's not base32 or ascii85.

  console.log(Buffer.from(SWIFT,'base64').toString('utf8')); // try a straight decode as before, outputs gibberish!

  // like with other ls output, perhaps there is a clue in the listing
  // ECB: DOC: SWIFT
  // ECB is the simplest of encryption modes: https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_codebook_(ECB) 
  // However we need to know the encryption algorithm.
  // `whois HISAC`: HISAC: Decomissioned: 16/02/74.
  // DES algorithm dates to the early 70's. So:
  const crypto = require('crypto'),
      algorithm = 'des-ecb'; 
  // Other modes also require an initial value (iv) but we only have some possible keys so that's another 
  // reason to think ECB.
  
  const decrypt = (text,password) => {

    let decipher = crypto.createDecipheriv(algorithm,password,null); // ECB has no iv so set to null
    decipher.setAutoPadding(false); // it already looks padded, and leaving this out generates an error.
    let dec = decipher.update(text,'base64','utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  // The most obvious key to start with is the contents of FREEBIRD (free the bird=swift), 
  // which we know from running index.js with some logical guesses in guesses.txt
  // from /CLASSIFIED/FREEEBIRD INTERLINK (hex > text gives 'iron oxide').
  // The key for /ARCHIVES/FREEBIRD turns out to be ferrous with contents = the chemical formula Fe2O3
  
  // So, let's try that:
  let key = Buffer.from('Fe2O3').toString('base64');
  console.log(decrypt(SWIFT, key)); // nope

  // Let's try some older ideas from HISAC:

  key = Buffer.from('this').toString('base64');
  console.log(decrypt(SWIFT, key)); // also nope

  key = Buffer.from('candle').toString('base64');
  console.log(decrypt(SWIFT, key)); // also nope

  key = Buffer.from('openportal').toString('base64'); 
  console.log(decrypt(SWIFT, key)); // wrong key length
  
}

main();