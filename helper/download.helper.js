const https = require('https');
const fs = require('fs');
const { THEME_FOLDER } = process.env
const spawn = require('child_process').spawn;

const downloadFile = async (url, dest, fileName) => {
  return new Promise(async (resolve, reject) => {
    var file = await fs.createWriteStream(dest);
    https.get(url, async function(response) {
      await response.pipe(file);
      await file.on('finish', async function() {
        await file.close();
          await extractZip(fileName)
          resolve(true)
      })
    })
  })
}

const extractZip = async (fileName) => {
  return new Promise(async (resolve) => {
    const child = await spawn(`unar -d ${fileName}`, {
      cwd: THEME_FOLDER,
      shell: true,
      stdio: 'inherit',
    });
    child.on('close', async (code) => {
      console.log('-----------Files Extracted------------');
      return resolve(true)
    })
  })
}

export default downloadFile