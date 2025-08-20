 const crypto = require("crypto");

function generateLowercaseString(length = 16) {
  const bytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    const charCode = 97 + (bytes[i] % 26); 
    result += String.fromCharCode(charCode);
  }

  return result;
}

module.exports = {generateLowercaseString}
