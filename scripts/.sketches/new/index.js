const Translate = require ('./translate');

function translateInput () {
  return new Promise (resolve => {
    Translate.getTranslation ('Hello, world!', 'en', 'fr');
  });
}

async function asyncCall () {
  console.log ('Getting the translation:\n');
  const result = await translateInput ();
  console.log (result);
}

asyncCall ();
