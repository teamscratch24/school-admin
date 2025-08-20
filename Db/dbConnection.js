const mongoose = require('mongoose');
const dbURI = process.env.DB_URL

 const dbConnection =  async() => {
   await mongoose.connect(dbURI)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error:', err);
      });

}

module.exports = dbConnection;

