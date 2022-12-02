import syncDirectory from '../helper/syncDir.helper'
import getHtmlFiles from '../helper/getHtmlFiles.helper'
import replaceURL from '../helper/replaceURL.helper'

const uploadTheme = async (req, res) => {
  try {
    const dir = process.env.THEME_FOLDER

    const files = await syncDirectory(dir, dir)

    // const cssDir = dir+'assets/css/'
    // const jsDir = dir+'assets/js/'
    // const imgDir = dir+'assets/img/'

    // const cssFiles = await syncDirectory(cssDir, dir)
    // const jsFiles = await syncDirectory(jsDir, dir)
    // const imgFiles = await syncDirectory(imgDir, dir)
    // console.log(cssFiles, jsFiles, imgFiles)
    
    const htmlFiles = await getHtmlFiles(dir, dir)
    const uploadedFile = await replaceURL(htmlFiles, files)
    // const uploadedFile = await replaceURL(htmlFiles, [...jsFiles, ...cssFiles, ...imgFiles])
    // console.log(htmlFiles)

  } catch (e) {
    console.log(e)
  }
}

export default {
  uploadTheme
}