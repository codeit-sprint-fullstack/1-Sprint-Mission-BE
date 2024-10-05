// src/controllers/imageController.js
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imagePath = `/uploads/${req.file.filename}`;
  res.json({ imagePath });
};
