import controller from './../controller/index';
import _ from './../middleware/bypassdb.middleware';
import FileUpload from '../middleware/fileupload.middleware';
const fileUpload = require('express-fileupload');

const routes = ({ app }) => {
  var _db = { app };
  app.route('/:projectId/upload_theme').post(_(_db), fileUpload(), FileUpload, controller.uploadTheme);
};

export default routes;
