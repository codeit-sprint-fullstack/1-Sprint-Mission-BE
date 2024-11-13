import * as ss from "superstruct";

import { urlPattern } from "../pattern/pattern.js";
import { productSchema } from "../constants/product.js";
import { tagSchema } from "../constants/tag.js";

export const Product = ss.object({
  name: ss.size(
    ss.string(),
    productSchema.MIN_LENGTH_NAME,
    productSchema.MAX_LENGTH_NAME
  ),
  description: ss.size(
    ss.string(),
    productSchema.MIN_LENGTH_DESCRIPTION,
    productSchema.MAX_LENGTH_DESCRIPTION
  ),
  price: ss.refine(
    ss.integer(),
    "Price Range",
    (value) =>
      productSchema.MIN_PRICE <= value && value <= productSchema.MAX_PRICE
  ),
  images: ss.size(
    ss.array(urlPattern),
    productSchema.MIN_COUNT_IMAGE,
    productSchema.MAX_COUNT_IMAGE
  ),
  tags: ss.size(
    ss.array(
      ss.size(ss.string(), tagSchema.MIN_LENGTH_TAG, tagSchema.MAX_LENGTH_TAG)
    ),
    productSchema.MIN_COUNT_TAG,
    productSchema.MAX_COUNT_TAG
  ),
});
