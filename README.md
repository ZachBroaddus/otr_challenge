# otr_challenge
Code challenge for OTR Transportation

-------------------------------------
To run the cli app, use `node app.js <filenames>`
Any files located in the `records` directory can be selected.<br/>
You may add files or records to the existing files, provided they are in the same format as the existing `.csv` files.<br/>
Please be sure to run `npm i` before attempting to run the app or server.

To run the server, use `node server.js`<br/>
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
