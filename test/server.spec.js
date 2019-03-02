const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
chai.use(require('chai-sorted'));
chai.use(require('chai-datetime'));
chaiHttp = require('chai-http');
const server = require('../server').appServer;
chai.use(chaiHttp);


describe('Server', function () {

	describe('GET /records/name', () => {
	  it('it should GET all records sorted by last name descending', (done) => {
	    chai.request(server)
	      .get('/records/name')
	      .end((err, res) => {
	        res.should.have.status(200);
	        res.body.records.should.be.an('array');
	        expect(res.body.records).to.be.sortedBy('lastName', { descending: true });
	        done();
	      });
	  });
	});

	describe('GET /records/gender', () => {
	  it('it should GET all records sorted by gender first, then last name ascending', (done) => {
	    chai.request(server)
	      .get('/records/gender')
	      .end((err, res) => {
	        res.should.have.status(200);
	        res.body.records.should.be.an('array');
	        expect(res.body.records).to.be.sortedBy('gender', { ascending: true });

	        let filteredRecords;
		      filteredRecords = res.body.records.filter(r => r.gender === 'female');
		      expect(filteredRecords).to.be.sortedBy('lastName', { ascending: true });

		      filteredRecords = res.body.records.filter(r => r.gender === 'female');
		      expect(filteredRecords).to.be.sortedBy('lastName', { ascending: true });

	        done();
	      });
	  });
	});

	describe('GET /records/birthdate', () => {
	  it('it should GET all records sorted by birthdate ascending', (done) => {
	    chai.request(server)
	      .get('/records/birthdate')
	      .end((err, res) => {
	        res.should.have.status(200);
	        res.body.records.should.be.an('array');
		      const firstRecord = new Date(res.body.records[0].dob);
		      const lastRecord = new Date(res.body.records[res.body.records.length -1].dob);
		      expect(firstRecord).to.be.beforeDate(lastRecord);
	        done();
	      });
	  });
	});

	describe('POST /records', () => {

		it('it should POST a record or array of records', (done) => {

			const recordsToPost = { "records": 
				[
					["Gribble,Bernardo,Male,Goldenrod,4/16/2018"],
					["Asbury|Marijn|Male|Red|10/5/2018"],
					["Brixey Gloriane Female Indigo 2/12/2019"]
				]
			}

	    chai.request(server)
	      .post('/records')
	      .set('content-type', 'text/plain')
	      .send(JSON.stringify(recordsToPost))
	      .end((err, res) => {
	        res.should.have.status(200);
	        res.body.should.be.an('object');
	        res.body.should.have.property('message').eql('Record(s) successfully added!');
	        res.body.should.have.property('records');
	        res.body.records.should.be.an('array');
	        done();
	      });

    });
	})

});
