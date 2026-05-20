function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (err) {
      return res.status(400).json(err.errors);
    }
  };
}

export default validate;