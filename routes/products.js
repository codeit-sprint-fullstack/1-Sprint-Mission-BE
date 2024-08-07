import createProduct from "./routes/createProduct.js";
import getProducts from "./routes/getProducts.js";
import updateProduct from "./routes/updateProduct.js";
import deleteProduct from "./routes/deleteProduct.js";

export default function products() {
  app.use("/", createProduct);
  app.use("/", getProducts);
  app.use("/", updateProduct);
  app.use("/", deleteProduct);
}
