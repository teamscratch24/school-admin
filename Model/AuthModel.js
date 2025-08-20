const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String , required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secret: { type: String, default: null },
  role: { type: String, enum: ["superadmin", "admin"], default: "admin" }
});

UserSchema.methods.comparePassword = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};              

const userModel = mongoose.model('admin', UserSchema);

module.exports = userModel;
