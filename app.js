#!/usr/bin/env node

const chalk = require('chalk');
const args = process.argv;
const rl = require('readline');
const fs = require('fs');
const path = require('path');

const promisify = require('util').promisify;
const readdirPromise = promisify(fs.readdir);
const asyncUtil = require('async');
const moment = require('moment');
const cTable = require('console.table');

const recordsDirectory = path.join(__dirname, '/records');
let records = [];
let recordObjects = [];

const usage = () => {
  const instructions = `
  This app will display records from files that you specify, within the ./records directory.
  You may select a formatting option from the list below.

  usage:
    node app.js <filenames>

    You will then be prompted to select an option.

    display options include:

    gender    - used to display records sorted by gender (female first), then last name asc
    birthdate - used to display records by dob asc
    name      - used to display records by last name desc

    other options:

    help      - used to print the usage guide
    quit      - used to exit the program
  `
  console.log(chalk.magenta(instructions));
}

const errorLog = (error) => {
  const errorLog = chalk.red(error);
  console.log(errorLog);
}

const prompt = (phrase) => {
  const interface = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  return new Promise((resolve, reject) => {
    interface.question(phrase, answer => {
      interface.close();
      resolve(answer);
    })
  })
}

const readFiles = (filesToRead) => {
	return new Promise(async (resolve, reject) => {
		try {
			const files = await readdirPromise(recordsDirectory)
			if (!files || !files.length) {
				reject('No records were found. Please ensure that there are files in the ./records directory that contain valid records.');
			}
			resolve(files);
		} catch (error) {
			reject(error);
		}
	})
}

const ensureArgsValidity = (filesToRead, filesFound) => {
	return new Promise((resolve, reject) => {
		try {
			filesToRead.forEach(file => {
				if (!filesFound.includes(file)) throw 'One or more of the files you attempted to read could not be found.';
			})
			resolve(true);
		} catch (error) {
			errorLog(`an error occurred while reading the files: ${error}`);
			resolve(false);
		}
	})
}

const parseFile = (file) => {
	return new Promise((resolve, reject) => {
		try {
			const lineReader = require('readline').createInterface({
			  input: require('fs').createReadStream(`${recordsDirectory}/${file}`)
			});

			lineReader.on('line', (line) => {
				const record = line.split(/[ ,|]+/);
			  records.push(record);
			})
			.on('close', () => {
				resolve();
			})
		} catch (error) {
			errorLog(error);
			reject();
		}
	})
}

const mapRecordsToObjects = (records) => {
	return records.map(r => {
		return {
			firstName: r[1],
			lastName: r[0],
			gender: r[2],
			favoriteColor: r[3],
			dob: moment(r[4], 'L').format('L')
		}
	})
}

const sortRecords = (recordObjects, selectedOption) => {
	switch(selectedOption) {
		case 'gender':
			return sortByGender(recordObjects);
			break;
		case 'birthdate':
			return sortByBirthdate(recordObjects);
			break;
		case 'name':
			return sortByName(recordObjects);
			break;
	}
}

const displayRecords = (sortedRecords) => {
	console.log('\n');
	console.table(sortedRecords);
}

const sortByGender = (recordObjects) => {
	return recordObjects.sort((a, b) => {          
    if (a.gender === b.gender) {
      return (a.lastName > b.lastName) - (a.lastName < b.lastName);
    }
    return a.gender > b.gender ? 1 : -1;
	});
}

const sortByBirthdate = (recordObjects) => {
	return recordObjects.sort((a, b) => (new Date(a.dob) > new Date(b.dob)) - (new Date(a.dob) < new Date(b.dob)));
}

const sortByName = (recordObjects) => {
	return recordObjects.sort((a, b) => (a.lastName < b.lastName) - (a.lastName > b.lastName));
}

const sortAndDisplayRecords = (selectedOption) => {
	const sortedRecords = sortRecords(recordObjects, selectedOption);
	displayRecords(sortedRecords);
}


// File runner
(async () => {
	if (args.length >= 3 && !args.includes('spec')) {
		const filesToRead = args.slice(2);
		const filesFound = await readFiles(filesToRead);
		const argsAreValid = await ensureArgsValidity(filesToRead, filesFound);
		if (!argsAreValid) return;

		await asyncUtil.each(filesToRead, async (file) => {
			try {
				await parseFile(file);
			} catch (error) {
				errorLog(error);
				return;
			}
		}, async (error) => {
		  if (error) errorLog(`an error occurred while reading the files: ${error}`);
			recordObjects = mapRecordsToObjects(records);
		});

		let exitRequested = false;

		while(!exitRequested) {
			const promptText = chalk.magenta('Please select an option or type help for a list of options:\n');
			await prompt(promptText).then(async selectedOption => {

				switch(selectedOption) {
					case 'name':
						sortAndDisplayRecords(selectedOption);
						break;
					case 'gender':
						sortAndDisplayRecords(selectedOption);
						break;
					case 'birthdate':
						sortAndDisplayRecords(selectedOption);
						break;
					case 'help':
						usage();
						break;
					case 'quit':
						exitRequested = true;
						console.log('Bye!')
						break;
				  default:
				    errorLog(`\n\xa0\xa0invalid command passed: ${selectedOption}`);
				    usage();
				}

			})
		}
	}
})()

module.exports = {
	mapRecordsToObjects: mapRecordsToObjects,
	sortByGender: sortByGender,
	sortByBirthdate: sortByBirthdate,
	sortByName: sortByName,
	parseFile: parseFile,
	errorLog: errorLog,
	records: records
};
