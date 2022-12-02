const Datatype = ({ app }) => {
  return function (req, res, next) {
    req.app = app;
    next();
  };
};

export default Datatype;
