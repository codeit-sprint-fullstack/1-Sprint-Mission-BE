import createProduct from "./routes/createProduct.js";
import getProducts from "./routes/getProducts.js";
import updateProduct from "./routes/updateProduct.js";
import deleteProduct from "./routes/deleteProduct.js";

export default function products() {
  app.use("/products", createProduct);
  app.use("/products", getProducts);
  app.use("/products", updateProduct);
  app.use("/products", deleteProduct);
}
