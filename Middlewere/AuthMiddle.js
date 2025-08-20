const jwt = require('jsonwebtoken');
const userModel = require('../Model/AuthModel');


const AuthCheck =async (req, res, next) => {
    try{
  const token = req.headers['authorization'];
  
  const BearerToken = token && token.startsWith('Bearer ') ? token.split(' ')[1] : null;

  if (!BearerToken) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const { userId } = jwt.decode(BearerToken);

  if (!userId) {
    return res.status(401).json({ msg: 'Invalid token' });
  }

  const CurrentUser = await userModel.findById(userId);


  if (!CurrentUser) {                
    return res.status(401).json({ msg: 'User not found' });
    }

    const decoded = jwt.verify(BearerToken, CurrentUser.secret);
    req.Id = decoded.userId;
    req.role = CurrentUser.role;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ msg: 'Invalid token' });
  }
}

module.exports = AuthCheck;