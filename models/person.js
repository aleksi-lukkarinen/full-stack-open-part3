// Some test data:
//   Bart Simpson   SPRINGVILLE-3599 2863
//   Darth Vader    DEATHSTAR-9911 9119
//   James T. Kirk  ENTERPRISE-000 0001
//   Lisa Simpson   SPRINGVILLE-1291 5595
//   Scrooge McDuck DUCKBURG-9588 2538
//   Donald Duck    DUCKBURG-313 1313
//   Gyro Gearloose DUCKBURG-999 1243 6978
//   Roger Rabbit   TOONTOWN-1928 7364

const MONGO_USER_NAME = process.env.MONGO_USER_NAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_CLUSTER_NAME = process.env.MONGO_CLUSTER_NAME
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME

const EXIT_CODE_FAILURE = 1

const MIN_LENGTH_NAME = 3
const MIN_LENGTH_PHONENUMBER = 8

function buildMongoConnUrl(userName, password, clusterName, databaseName) {
  const url =
      `mongodb+srv://${userName}:${password}` +
      `@${clusterName}.vdyge.mongodb.net/${databaseName}?` +
      "retryWrites=true&w=majority"

  return url
}


const mongoose = require("mongoose")
var uniqueValidator = require("mongoose-unique-validator")

const MONGO_CNN_URL = buildMongoConnUrl(
  MONGO_USER_NAME, MONGO_PASSWORD, MONGO_CLUSTER_NAME, MONGO_DATABASE_NAME)
const mongoCnnOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

console.log("Trying to connect to the database...")
mongoose
  .connect(MONGO_CNN_URL, mongoCnnOpts)
  .catch(reason => {
    console.error("Connecting to Mongo database failed: ", reason.message)
    process.exit(EXIT_CODE_FAILURE)
  })

console.log("Setting up database schemata...")
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: MIN_LENGTH_NAME,
    trim: true,
    index: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: MIN_LENGTH_PHONENUMBER,
    trim: true,
  },
})
personSchema.plugin(uniqueValidator)
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = {
  model: mongoose.model("Person", personSchema),
  MIN_LENGTH_NAME: MIN_LENGTH_NAME,
  MIN_LENGTH_PHONENUMBER: MIN_LENGTH_PHONENUMBER,
}
