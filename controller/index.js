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
    console.log(uploadedFile)

    return res.status(200).json({
      data: 'theme uploaded successfully'
    })

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      msg: e.message
    })
  }
}

export default {
  uploadTheme
}