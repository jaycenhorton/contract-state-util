const config = require('truffle-config');
const path = require('path');
const shell = require('shelljs');
const fs = require('fs');
const argv = require('yargs').argv;

function createContractsFromArtifacts() {
  if (path.resolve('./lib/artifacts.js')) {
    fs.unlink(path.resolve('./lib/artifacts.js'));
  } else {
    fs.write(path.resolve('./lib/artifacts.js'));
  }

  const truffleConfig = argv.truffleConfigLoc
    ? config.load(path.resolve(argv.truffleConfigLoc), {})
    : config.load(path.resolve('./truffle.js'), {});

  const artifactsDir =
    truffleConfig.contracts_build_directory || './build/contracts';

  const contracts = {};
  const artifactNames = shell.ls(`${artifactsDir}/*.json`);
  artifactNames.forEach(name => {
    const contractName = path.basename(name).replace('.json', '');

    if (contractName === 'Migrations') return;

    try {
      fs.appendFile(
        path.resolve('./lib/artifacts.js'),
        `export { default as ${contractName} } from '${name}';\n`,
        err => {
          if (err) {
            // append failed
            // console.log(err);
          } else {
            // done
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  });
  return contracts;
}
createContractsFromArtifacts();
