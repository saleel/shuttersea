import multiparty from 'multiparty';

export default function formData(req, res, next) {
  const form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
    } else {
      req.body = fields;
      Object.keys(req.body).forEach((k) => { req.body[k] = req.body[k][0]; });
      req.files = files;
      Object.keys(req.files).forEach((k) => { req.files[k] = req.files[k][0]; });
      next();
    }
  });
}
