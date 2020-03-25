const express = require('express');
const lineByLine = require('n-readlines');
const fileName = "packages.txt";
const app = express();
const port = 3000;

const fieldsToExtract = ["Package", "Version", "Description", "SHA256", "Dependencies", "Recommends", "Conflicts"];


function findPackage(packageName) {
    const liner = new lineByLine(fileName);
    let line;
    let packageFound = false;
    let res = {};
    let field, value;

    while (line = liner.next()) {
        line = line.toString('ascii');
        if (line.length !== 0) {
            [field, value] = line.split(":", 2);

            if ((field === "Package" && value.trim() === packageName.trim()) || packageFound === true) {
                // We found it!
                packageFound = true;
                if (fieldsToExtract.includes(field)) {
                    res[field] = value.trim();
                }
            }
        } else if (packageFound) {
            return res;
        }
    }
}


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/search/:name', (req, res) => {
    res.json(findPackage(req.params.name));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
