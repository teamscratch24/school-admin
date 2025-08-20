const userModel = require("../Model/AuthModel");
const { generateToken } = require("../utils/TokenGenerator");
const bcrypt = require("bcryptjs");
const { generateLowercaseString } = require("../utils/SecGenerator");
const { textRegex, EmailRegex, passwordRegex } = require("../utils/Regex");

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "You are not a user" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const secret = generateLowercaseString();

    await userModel.findByIdAndUpdate(user._id, { secret }, { new: true });

    const token = generateToken(user._id, user.role, secret);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const CreateAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(req.role === "superadmin")) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to create an admin" });
    }

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (
      !textRegex(username) ||
      !EmailRegex(email) ||
      !passwordRegex(password)
    ) {
      return res.status(400).json({ msg: "Please Give valid inputs" });
    }

    const AdminCheck = await userModel.find({ email });

    if (AdminCheck.length > 0) {
      return res.status(409).json({ msg: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username: username || "User",
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();

    res.status(201).json({ msg: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const GetAdmins = async (req, res) => {
  try {
    if (!(req.role === "superadmin")) {
      return res.status(403).json({ msg: "You are Unauthorized" });
    }

    const Admins = await userModel
      .find({ role: { $ne: "superadmin" } })
      .select("username email");

    return res.status(200).json({ value: Admins });
  } catch (error) {
 
    return res.status(500).json({ msg: "internal server error" });
  }
};

const DeleteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!(req.role === "superadmin")) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to Delete an admin" });
    }

    const findUser = await userModel.findOne({ _id: userId });

    if (!findUser) {
      return res.status(204).json({ msg: "User Not Found" });
    }

    await userModel.deleteOne({ _id: userId });

    return res.status(200).json({ msg: "Succefully Deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const CreateSuperAdmin = async (req, res) => {
  try {
    const findSuperAdminExist = await userModel.find();

    if (findSuperAdminExist.length > 0) {
      return res.status(200).json({ msg: "Superadmin already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      10
    );

    if (
      !process.env.SUPERADMIN_USERNAME ||
      !process.env.SUPERADMIN_EMAIL ||
      !process.env.SUPERADMIN_PASSWORD
    ) {
      return 
    }

    await userModel.create({
      username: process.env.SUPERADMIN_USERNAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    });

    return true;

  } catch (error) {
    return { message: "Internal server error" + error.message };
  }
};

module.exports = {
  logIn,
  CreateAdmin,
  CreateSuperAdmin,
  GetAdmins,
  DeleteAdmin,
};
