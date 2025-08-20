const jwt = require("jsonwebtoken");

const generateToken = (userId,role,secret) => {
    const token = jwt.sign({ userId,role}, secret, { expiresIn: "48h" });
    return token;
};


module.exports = {
    generateToken
};
