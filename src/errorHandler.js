function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    res.status(400).send({ message: err.message });
  } else if (err.name === "CastError") {
    res.status(404).send({ message: "Cannot find given id." });
  } else {
    res.status(500).send({ message: err.message });
  }
}

export default errorHandler;
