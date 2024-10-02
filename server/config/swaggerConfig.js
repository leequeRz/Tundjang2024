const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "A description of your API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "api server localhost",
      },
      {
        url: "https://register.vercel.app",
        description: "api production server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;

//แก้
