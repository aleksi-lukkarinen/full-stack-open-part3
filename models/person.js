const MONGO_USER_NAME = process.env.MONGO_USER_NAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_CLUSTER_NAME = process.env.MONGO_CLUSTER_NAME
const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME

const EXIT_CODE_FAILURE = 1

function buildMongoConnUrl(userName, password, clusterName, databaseName) {
  const url =
      `mongodb+srv://${userName}:${password}` +
      `@${clusterName}.vdyge.mongodb.net/${databaseName}?` +
      "retryWrites=true&w=majority"

  return url
}


const mongoose = require("mongoose")

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
  name: String,
  phoneNumber: String,
})
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
