import syncDirectory from '../helper/syncDir.helper'
import getHtmlFiles from '../helper/getHtmlFiles.helper'
import replaceURL from '../helper/replaceURL.helper'
import themeModel from '../model/export.model'
import deleteS3Folder from '../helper/deleteS3Folder.helper'
import downloadFile from '../helper/download.helper'
import deleteZip from '../helper/deleteZip.helper'
import { v4 as uuidv4 } from 'uuid';
import path from 'path'
const { THEME_FOLDER, S3_BUCKET_URL } = process.env

const uploadTheme = async (req, res) => {
  try {
    const { s3zip, params } = req
    const { projectId } = params;
    const dir = THEME_FOLDER
    
    let fileName = uuidv4()
    let zipName = `${fileName}${path.extname(s3zip?.Location)}`
    let zipDestination = `${dir}/${zipName}`
    let destination = `${dir}/${fileName}`

    await downloadFile(s3zip?.Location, zipDestination, zipName)
    console.log('-------zip download & extracted--------')

    await deleteS3Folder(projectId)
    console.log('-------old files deleted--------')

    const { js, css, img, doc } = await syncDirectory(destination, projectId)
    console.log('-------asstes all file uploaded--------')

    const htmlFiles = await getHtmlFiles(destination, projectId)
    console.log('-------html file grouped--------')

    let syncFiles = [...js, ...css, ...img, ...doc]
    await replaceURL(htmlFiles, syncFiles)
    console.log('-------html file uploaded--------')

    themeModel({ projectId: projectId, s3path: `${S3_BUCKET_URL}/${projectId}/theme`}).save().then()
    console.log('-------uploaded successfully--------')
    
    await deleteZip(zipDestination, destination)
    console.log('-------zip & folder removed--------')

    return res.status(200).json({
      data: 'theme uploaded successfully',
      array: { css, js, img, doc }
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