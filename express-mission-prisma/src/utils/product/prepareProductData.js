function prepareProductData(req) {
  let creatData = {};
  let imagePath = {};

  if (req.files && req.files.length > 0) {
    creatData = { ...req.body, image: req.files };

    req.files.map((file) => {
      imagePath[file.originalname] = file.path;
    });
  } else {
    creatData = { ...req.body, image: [] };
  }

  return { creatData, imagePath };
}

export default prepareProductData;
