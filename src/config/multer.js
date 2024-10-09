import multer from 'multer';

const uploadImg = multer({ dest: 'uploads/' });

export default uploadImg;
