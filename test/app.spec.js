const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
chai.use(require('chai-sorted'));
chai.use(require('chai-datetime'));

const cliScript = require('../app');

const testRecords = [
  ['Plummer','Thom','Male','Teal','9/27/1954'],
  ['Cosgrave','Austin','Female','Fuscia','11/11/1972'],
  ['Ortiga','Anton','Male','Violet','6/24/1942'],
  ['Bothie','Terry','Female','Turquoise','3/27/1921']
]

const testRecordObjects = [ 
  { firstName: 'Felisha',
    lastName: 'Spreadbury',
    gender: 'Female',
    favoriteColor: 'Red',
    dob: '10/5/1910' 
  },
  { firstName: 'Keelia',
    lastName: 'Filipiak',
    gender: 'Female',
    favoriteColor: 'Maroon',
    dob: '6/1/1962' 
  },
  { firstName: 'Ancell',
    lastName: 'Gadsdon',
    gender: 'Male',
    favoriteColor: 'Yellow',
    dob: '4/17/1916' 
  },
  { firstName: 'Layne',
    lastName: 'Huggin',
    gender: 'Female',
    favoriteColor: 'Green',
    dob: '12/29/1932' 
  } 
]

describe('CLI Script', function () {

  describe('mapRecordsToObjects', function(){

    it('should return an array', function(){
      const recordObjects = cliScript.mapRecordsToObjects(testRecords);
      recordObjects.should.be.an('array');
    });

    it('should return objects that have firstName, lastName, gender, favoriteColor, and dob keys', function(){
      const recordObjects = cliScript.mapRecordsToObjects(testRecords);
      const randomObject = recordObjects[Math.floor(Math.random()*recordObjects.length)];
      expect(randomObject).to.have.keys(['firstName', 'lastName', 'gender', 'favoriteColor', 'dob']);
    });

  });

  describe('sortByGender', function () {

    it('should return an array of objects sorted by gender', function (){
      const sortedRecords = cliScript.sortByGender(testRecordObjects);
      expect(sortedRecords).to.be.sortedBy('gender', { ascending: true });
    })

    it('should return an array of objects where the females are sorted by last name ascending', function (){
      const sortedRecords = cliScript.sortByGender(testRecordObjects);
      const filteredRecords = sortedRecords.filter(r => r.gender === 'female');
      expect(filteredRecords).to.be.sortedBy('lastName', { ascending: true });
    })

    it('should return an array of objects where the males are sorted by last name ascending', function (){
      const sortedRecords = cliScript.sortByGender(testRecordObjects);
      const filteredRecords = sortedRecords.filter(r => r.gender === 'male');
      expect(filteredRecords).to.be.sortedBy('lastName', { ascending: true });
    })
    
  })

  describe('sortByBirthdate', function () {

    it('should return an array of objects sorted by birthdate ascending', function (){
      const sortedRecords = cliScript.sortByBirthdate(testRecordObjects);
      const firstRecord = new Date(sortedRecords[0].dob);
      const lastRecord = new Date(sortedRecords[sortedRecords.length -1].dob);
      expect(firstRecord).to.be.beforeDate(lastRecord);
    })
 
  })

  describe('sortByName', function () {

    it('should return an array of objects sorted by last name descending', function (){
      const sortedRecords = cliScript.sortByName(testRecordObjects);
      expect(sortedRecords).to.be.sortedBy('lastName', { descending: true });
    })

  })

});
