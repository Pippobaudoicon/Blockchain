const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

function compilingPreparations(){
    const buildPath = path.resolve(__dirname, "build");
    fs.removeSync(buildPath);
    return buildPath;
}

/**
* Returns and Object describing what to compile and what need to be returned.
*/
function createConfiguration() {
    return {
        language: 'Solidity',
        sources: {
            'Inbox': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Inbox.sol'), 'utf8')
            },/*
            'AnotherFileWithAContractToCompile.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'AnotherFileWithAnContractToCompile.sol'), 'utf8')
            }*/
        },
        settings: {
            outputSelection: { // return everything
                '*': {
                    '*': ['*']
                }
            }
        }
    };
};

/**
* Searches for dependencies in the Solidity files (import statements). All import Solidity files
* need to be declared here.
* @param dependency
* @returns {*}
*/
function getImports(dependency) {
    console.log('Searching for dependency: ', dependency);
    switch (dependency) {
        case 'InboxFunctions.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'InboxFunctions.sol'), 'utf8')};

        /*case 'AnotherImportedSolidityFile.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'AnotherImportedSolidityFile.sol'), 'utf8')};*/
        default:
            return {error: 'File not found'}
    }
}

/**
 * Compiles the sources, defined in the config object with solc-js.
 * @param config - Configuration object.
 * @returns {any} - Object with compiled sources and errors object.
 */
function compileSources(config) {
    try {
        return JSON.parse(solc.compile(JSON.stringify(config), { import: getImports }));
    } catch (e) {
        console.log(e);
    }
}

/**
* Shows when there were errors during compilation.
* @param compiledSources
*/
function errorHandling(compiledSources) {
    if (!compiledSources) {
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n', 'NO OUTPUT');
    } else if (compiledSources.errors) { // something went wrong.
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
        compiledSources.errors.map(error => console.log(error.formattedMessage));
    }
}

/**
* Writes the contracts from the compiled sources into JSON files, which you will later be able to
* use in combination with web3.
* @param compiled - Object containing the compiled contracts.
* @param buildPath - Path of the build folder.
*/
function writeOutput(compiled, buildPath) {
    fs.ensureDirSync(buildPath);
    
    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        console.log('Writing: ', contractName + '.json');
        fs.outputJsonSync(
            path.resolve(buildPath, contractName + '.json'),
            compiled.contracts[contractFileName][contractName]
        );
    }
}

const buildPath = compilingPreparations();
const config = createConfiguration();
const compiled = compileSources(config);
console.log(compiled);
//console.log(config);
errorHandling(compiled);
writeOutput(compiled, buildPath);

//console.log(JSON.parse(solc.compile((JSON.stringify(source)))));