///////// SERVER
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// env variable before app:
dotenv.config({ path: './config.env' });
const app = require('./app');

// replace pw placeholder in env
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// mongoose is an object data modelling library for Mongo & Node
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // added to remove deprecation warning - watch me
  })
  .then((connection) => {
    // console.log(connection.connections);
    console.log('DB connection successfully established.');
  });

// START server
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});
