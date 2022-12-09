import syncDirectory from '../helper/syncDir.helper'
import getHtmlFiles from '../helper/getHtmlFiles.helper'
import replaceURL from '../helper/replaceURL.helper'
import themeModel from '../model/export.model'
import deleteS3Folder from '../helper/deleteS3Folder.helper'
const { THEME_FOLDER, S3_BUCKET_URL } = process.env

const uploadTheme = async (req, res) => {
  try {
    const { document_upload, params } = req
    const { projectId } = params;
    const dir = THEME_FOLDER

    console.log(document_upload)

    await deleteS3Folder(projectId)
    console.log('-------old files deleted--------')

    const { js, css, img, doc } = await syncDirectory(dir, projectId)
    console.log('-------asstes all file uploaded--------')

    const htmlFiles = await getHtmlFiles(dir, projectId)
    console.log('-------html file grouped--------')

    let syncFiles = [...js, ...css, ...img, ...doc]
    await replaceURL(htmlFiles, syncFiles)
    console.log('-------html file uploaded--------')

    themeModel({ projectId: projectId, s3path: `${S3_BUCKET_URL}/${projectId}/theme`}).save().then()
    console.log('-------uploaded successfully--------')

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