import * as ss from "superstruct";

export const urlPattern = ss.pattern(
  ss.string(),
  /^https?:\/\/[^\s$.?#].[^\s]*$/
);
export const emailPattern = ss.pattern(
  ss.string(),
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
