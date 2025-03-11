const fs = require("fs");

const createDirectoryIfNotExists = (publicPath) => {
  // Check if the folder exists, if not, create it
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
};

module.exports = {
  createDirectoryIfNotExists,
};
