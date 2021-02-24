const readline = require('readline');
const fs = require('fs');
const bent = require('bent'); // get bent

const rl = readline.createInterface({
  input: fs.createReadStream('guesses.txt')
});

const post = bent('https://api.hisac.computer/', 'POST', 'json', 200);

rl.on('line', async (line) => {
  const word = line.replace(/[\r\n]+$/g,''); // strip trailing new line chars
  const response = await post('command', {'func':'open','directory':'CLASSIFIED/','args':['PROJECT-JABBERWOCKY','-k',word]});
  console.log('trying',word);
  if ('content' in response) // bingo
  {
    console.log('key:',word,'\ncontent:',response.content);
  }
});
