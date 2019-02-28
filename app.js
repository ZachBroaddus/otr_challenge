#!/usr/bin/env node

const chalk = require('chalk');
const args = process.argv;
const rl = require('readline');

const displayOptions = ['gender', 'birthdate', 'name'];

const usage = () => {
  const instructions = `
  This app will display records from files that you specify, within the current directory.
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
	return new Promise((resolve, reject) => {
		try {
			// Read files here
			resolve(filesToRead);
		} catch (error) {
			reject(error);
		}
	})
}

const sortByGender = () => {

}

const sortByBirthdate = () => {

}

const sortByName = () => {

}


(async () => {
	let exitRequested = false;

	while(!exitRequested) {
		const promptText = chalk.magenta('Please select an option or type help for a list of options:\n');
		await prompt(promptText).then(async selectedOption => {

			if (displayOptions.includes(selectedOption)) {
				console.log('found the selected option within displayOptions!')
				try {
					const filesToRead = args.slice(2);
					console.log('filesToRead: ', filesToRead)
					const recordsToDisplay = await readFiles(filesToRead);
					recordsToDisplay.forEach(record => {
						// Display the record
						console.log('record: ', record)
					})
				} catch (error) {
					console.log(`an error occurred while reading the files: ${error}`)
				}
			} else {
				switch(selectedOption) {
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
			}
		})
	}

})()

