const { Image } = require("../models");

exports.uploadImage = async (req, res) => {
  const { productId, url } = req.body;
  try {
    const newImage = await Image.create({ productId, url });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: "이미지 업로드 실패", error });
  }
};

exports.getImagesByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const images = await Image.findAll({ where: { productId } });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "서버 에러", error });
  }
};

exports.deleteImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    const image = await Image.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ message: "이미지를 찾을 수 없습니다." });
    }
    await image.destroy();
    res.status(200).json({ message: "이미지 삭제 완료" });
  } catch (error) {
    res.status(500).json({ message: "이미지 삭제 실패", error });
  }
};
