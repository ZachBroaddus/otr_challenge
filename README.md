# otr_challenge
Code challenge for OTR Transportation

-------------------------------------
To run the cli app, use `node app.js <filenames>`

To run the server, use `node server.js`
The server runs on `localhost:3000`

To run the test suite, use `npm test`

Data posted to the `/records` route should be in the following format:
```
{ 
  "records": JSON.stringify(
    { 
      "data": [
        ["Gribble,Bernardo,Male,Goldenrod,4/16/2018"],
        ["Asbury|Marijn|Male|Red|10/5/2018"],
        ["Brixey Gloriane Female Indigo 2/12/2019"]
      ]
    }
  )
}
```
