const MONGO_USER_NAME = "PhoneBookApp"
const MONGO_CLUSTER_NAME = "free"
const MONGO_DATABASE_NAME = "PhoneBook"

const OPMODE_UNKNOWN = 0
const OPMODE_LIST = 1
const OPMODE_ADD = 2

const mongoose = require("mongoose")

function parseArgs(args) {
  const NUM_ARGS = args.length
  const OP_MODE =
    NUM_ARGS === 3 ? OPMODE_LIST :
      NUM_ARGS === 5 ? OPMODE_ADD :
        OPMODE_UNKNOWN

  if (OP_MODE === OPMODE_UNKNOWN) {
    console.log("Parameters: <password> [<name> <phone number>]")
    process.exit(1)
  }

  const PASSWORD = args[2]

  return [OP_MODE, PASSWORD]
}

function buildMongoConnUrl(userName, password, clusterName, databaseName) {
  const url =
      `mongodb+srv://${userName}:${password}` +
      `@${clusterName}.vdyge.mongodb.net/${databaseName}?` +
      "retryWrites=true&w=majority"

  return url
}

const [OPERATION_MODE, MONGO_PASSWORD] = parseArgs(process.argv)
const MONGO_CNN_URL = buildMongoConnUrl(
  MONGO_USER_NAME, MONGO_PASSWORD, MONGO_CLUSTER_NAME, MONGO_DATABASE_NAME)
const mongoCnnOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

console.log("Trying to connect to the database...")
mongoose.connect(MONGO_CNN_URL, mongoCnnOpts)

console.log("Setting up database schemas...")
const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})
const Person = mongoose.model("Person", personSchema)

switch (OPERATION_MODE) {
case OPMODE_LIST:
  console.log("Retrieving phonebook entries...")
  Person.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name}: ${entry.phoneNumber}`)
    })
    mongoose.connection.close()
  })
  break

case OPMODE_ADD:
  console.log("Adding a new phonebook entry...")

  const name = process.argv[3].trim()
  const number = process.argv[4].trim()

  const entry = new Person({
    name: name,
    phoneNumber: number,
  })
  entry.save().then(() => {
    console.log("Entry added successfully!")
    mongoose.connection.close()
  })
  break

default:
  console.log("Unexpected error: Unknown operation mode!")
}
