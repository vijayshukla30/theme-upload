const { THEME_FOLDER } = process.env
const spawn = require('child_process').spawn;

const downloadFile = async (zip, folder) => {
    return new Promise(async (resolve) => {
    const child = await spawn(`rm -r ${zip} && rm -r ${folder}`, {
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