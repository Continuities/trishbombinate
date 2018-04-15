const express = require('express');
const formidable = require('formidable');
const { exec } = require('child_process');
const argv = require('yargs')
    .option('port', {
        describe: 'Port to run on',
        default: 8080
    }).argv;

const app = express();

const UPLOAD_DIR = `${__dirname}/uploads`;

function _toGif(filename) {
    return `${filename.split('.').slice(0, -1).join('.')}.gif`;
}

app.use(express.static('www'));

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', (name, file) => {
        file.path = `${UPLOAD_DIR}/${file.name}`;
    });
    form.on('file', (name, file) => {
        console.log(`Received file ${file.name}`);
        const outName = _toGif(file.name);
        exec(`convert ${__dirname}/TrishBomb.gif -coalesce null: \\( ${UPLOAD_DIR}/${file.name} -resize 800x450^ -quality 100 -gravity center -extent 800x450 \\) -compose Dst_Over -layers composite -layers optimize ${__dirname}/www/bombs/${outName}`, (err, stdout, stderr) => {
            console.log(`${err}, ${stdout}, ${stderr}`);
            console.log(`Trishbombed ${outName}`);
            res.sendFile(`${__dirname}/www/bombs/${outName}`);
        });
    });
});

app.listen(argv.port, () => {
    console.log(`autotrishbomb running on port ${argv.port}`);
});

// Resize: convert test.jpg -resize 800x450^ -quality 100 -gravity center -extent 800x450 output.gif
// Compose: convert TrishBomb.gif -coalesce null: resized.jpg -compose Dst_Over -layers composite -layers optimize composed.gif
// All in one: convert TrishBomb.gif -coalesce null: \( test.jpg -resize 800x450^ -quality 100 -gravity center -extent 800x450 \) -compose Dst_Over -layers composite -layers optimize composed.gif