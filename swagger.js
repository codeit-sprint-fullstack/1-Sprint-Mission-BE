import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API 문서 설명",
  },
  host: "localhost:5432",
  schemes: ["http", "https"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js");
});
