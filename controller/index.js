import syncDirectory from '../helper/syncDir.helper'
import getHtmlFiles from '../helper/getHtmlFiles.helper'
import replaceURL from '../helper/replaceURL.helper'
import themeModel from '../model/export.model'
import deleteS3Folder from '../helper/deleteS3Folder.helper'

const uploadTheme = async (req, res) => {
  try {
    const { THEME_FOLDER, S3_BUCKET_URL } = process.env
    const { projectId } = req.params;
    const dir = THEME_FOLDER

    await deleteS3Folder(projectId)
    const files = await syncDirectory(dir, projectId)
    const htmlFiles = await getHtmlFiles(dir, projectId)
    await replaceURL(htmlFiles, files)
    themeModel({ projectId: projectId, s3path: `${S3_BUCKET_URL}/${projectId}/theme`}).save().then()

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