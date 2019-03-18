const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = new Router();

const asyncUtil = require('async');

const cliScript = require('./app');
const recordFiles = ['comma-delimited.csv', 'pipe-delimited.csv', 'space-delimited.csv'];
let recordObjects = [];
let postedRecords = [];


router.get('/', (ctx, next) => {
  ctx.body = "Thanks for reviewing my coding challenge. I'm looking forward to meeting the team at OTR Transportation!";
});

router.get('/records/gender', async (ctx, next) => {
	const foundRecords = await getAllRecords();
	const filteredRecords = filterUniqueRecords(foundRecords);
	const sortedRecords = cliScript.sortByGender(filteredRecords);
	ctx.set('Content-Type', 'json');
  ctx.body = { records: sortedRecords };
});

router.get('/records/birthdate', async (ctx, next) => {
	const foundRecords = await getAllRecords();
	const filteredRecords = filterUniqueRecords(foundRecords);
	const sortedRecords = cliScript.sortByBirthdate(filteredRecords);
	ctx.set('Content-Type', 'json');
  ctx.body = { records: sortedRecords };
});

router.get('/records/name', async (ctx, next) => {
	const foundRecords = await getAllRecords();
	const filteredRecords = filterUniqueRecords(foundRecords);
	const sortedRecords = cliScript.sortByName(filteredRecords);
	ctx.set('Content-Type', 'json');
  ctx.body = { records: sortedRecords };
});

router.post('/records', (ctx, next) => {
	const parsedRecords = ctx.request.body;

	parsedRecords.forEach((record) => {
		record = record.join().split(/[ ,|]+/);
		postedRecords.push(record);
	})

	ctx.body = { message: "Record(s) successfully added!", records: parsedRecords };
});

// Helper Functions
const getAllRecords = async () => {
	return new Promise(async (resolve, reject) => {
		await asyncUtil.each(recordFiles, async (file) => {
			try {
				await cliScript.parseFile(file);
			} catch (error) {
				cliScript.errorLog(error);
				reject(error);
			}
		}, async (error) => {
		  if (error) cliScript.errorLog(`an error occurred while reading the files: ${error}`);
		  const combinedRecords = cliScript.records.concat(postedRecords);
		  recordObjects = cliScript.mapRecordsToObjects(combinedRecords);
			resolve(recordObjects);
		});
	})
}

const filterUniqueRecords = (recordsToFilter) => {
	return recordsToFilter.filter((record, index, self) =>
	  index === self.findIndex((r) => (
	    r.lastName === record.lastName && r.birthdate === record.birthdate
	  ))
	)
}

app
	.use(koaBody())
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods());

const appServer = app.listen(3000, () => {
  console.log('Server listening on port: 3000');
});

module.exports =  { appServer: appServer };
