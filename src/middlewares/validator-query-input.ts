import { query, ValidationChain } from "express-validator";

import {
  PATTERN_ERROR_MESSAGES,
  RANGE_ERROR_MESSAGES,
} from "../constants/error";
import { queryLimit } from "../constants/query";

const validateQueryPage: ValidationChain = query("page")
  .optional()
  .isInt({ min: queryLimit.MIN_LENGTH_PAGE })
  .withMessage(RANGE_ERROR_MESSAGES["page"]);

const validateQueryPageNum: ValidationChain = query("pageNum")
  .optional()
  .isInt({ min: queryLimit.MIN_LENGTH_PAGE_NUM })
  .withMessage(RANGE_ERROR_MESSAGES["pageNum"]);

const validateQueryOrderBy: ValidationChain = query("orderBy")
  .optional()
  .isIn(Object.values(queryLimit.ORDER_BY))
  .withMessage(PATTERN_ERROR_MESSAGES["orderBy"]);

export const validateListQuery: ValidationChain[] = [
  validateQueryPage,
  validateQueryPageNum,
  validateQueryOrderBy,
];
