import controller from './../controller/index';
import _ from './../middleware/bypassdb.middleware';

const routes = ({ app }) => {
  var _db = { app };
  app.route('/:projectId/upload_theme').get(_(_db), controller.uploadTheme);
};

export default routes;
