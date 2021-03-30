const {option} = require ('commander');
const {program} = require ('commander');
const fs = require ('fs');
const Humanize = require ('humanize-string');
const Translate = require ('./translate');
const Tunnel = require ('tunnel');

program.version ('0.0.1');

var TranslateContent = false;

program
  .option ('-v, --verbose', 'verbose')
  .option ('-w, --write', 'write')
  .option ('-c, --console', 'console')
  .option ('-from, --fromLang <type>', 'fromLang')
  .option ('-to, --toLang <type>', 'toLang')
  .option ('-n, --name <type>', 'name')
  .option ('-d, --description <type>', 'description')
  .option ('-s, --summary <type>', 'summary');

program.parse (process.argv);

const options = program.opts ();
if (options.verbose) console.log (options);

if (options.fromLang || options.toLang) {
  TranslateContent = true;
}

console.log ('new content data:');
if (options.name) console.log (` name: ${options.name}`);
if (options.description) console.log (` description: ${options.description}`);
if (options.summary) console.log (` summary: ${options.summary}`);

if (options.console)
  printToConsole (
    `${options.name}`,
    `${options.description}`,
    `${options.summary}`,
    `${options.fromLang}`,
    `${options.toLang}`
  );

if (options.write)
  console.log (
    `\n write to ${options.name}.md`,
    writeToFile (
      `${options.name}`,
      `${options.description}`,
      `${options.summary}`,
      `${options.fromLang}`,
      `${options.toLang}`
    )
  );

/* -------------------------------------------------------------------------- */
/*                            print to the console                            */
/* -------------------------------------------------------------------------- */
function printToConsole (name, desc, summ, from = 'en', to = 'pt') {
  var doTranslate = TranslateContent
    ? '\n*** I will translate'
    : '\n*** I will NOT translate';
  console.log (`${doTranslate}`);

  var outName = TranslateContent
    ? Translate.getTranslation (`${name}`, `${from}`, `${to}`)
    : `${name}`;

  console.log ('\nThe output will be:\n');
  console.log ('---');
  console.log (`title: ${outName}`);
  console.log (`description: ${desc}`);
  console.log (`summary: ${summ}`);
  console.log ('cover: cover.jpg');
  console.log ('---\n');

  let title = Humanize (`${name}`);
  let summary = Humanize (`${summ}`);
  console.log (`# ${title}`);
  console.log (`${summary}\n`);
  console.log ('<!--more-->\n');
}

/* -------------------------------------------------------------------------- */
/*                                write to file                               */
/* -------------------------------------------------------------------------- */
function writeToFile (name, desc, summ, from, to) {
  let writeStream = fs.createWriteStream (`${options.name}.md`);

  /* ------------------------------- frontmatter ------------------------------ */
  writeStream.write ('---\n', 'ascii');
  writeStream.write (`title: ${name}\n`, 'ascii');
  writeStream.write (`description: ${desc}\n`, 'ascii');
  writeStream.write (`summary: ${summ}\n`, 'ascii');
  writeStream.write ('cover: cover.jpg\n', 'ascii');
  writeStream.write ('---\n', 'ascii');

  let title = Humanize (`${name}`);
  let summary = Humanize (`${summ}`);
  writeStream.write (`\n# ${title}\n`, 'ascii');
  writeStream.write (`${summary}\n`, 'ascii');
  writeStream.write ('\n<!--more-->\n\n');

  /* ------------ finish the stream and write the data to the file ------------ */
  writeStream.on ('finish', () => {
    console.log ('wrote all data to file');
  });

  // close the stream
  writeStream.end ();
}
