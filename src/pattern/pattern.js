import * as ss from "superstruct";

export const url = ss.pattern(ss.string(), /^https?:\/\/[^\s$.?#].[^\s]*$/);
