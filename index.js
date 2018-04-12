const express = require('express');
const formidable = require('formidable');
const argv = require('yargs')
    .option('port', {
        describe: 'Port to run on',
        default: 8080
    }).argv;

const app = express();

const UPLOAD_DIR = `${__dirname}/uploads`;

app.use(express.static('www'));

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', (name, file) => {
        file.path = `${UPLOAD_DIR}/${file.name}`;
    });
    form.on('file', (name, file) => {
        console.log(`Received file ${file.name}`);
        res.sendFile(`${UPLOAD_DIR}/${file.name}`);
    });
});

app.listen(argv.port, () => {
    console.log(`autotrishbomb running on port ${argv.port}`);
});