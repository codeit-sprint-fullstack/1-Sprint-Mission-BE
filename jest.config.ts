import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["js", "ts"],
};

export default config;
