const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

require("dotenv").config()

const PORT_TO_LISTEN = process.env.PORT

const HTTP_STATUS_NO_CONTENT = 204
const HTTP_STATUS_BAD_REQUEST = 400
const HTTP_STATUS_NOT_FOUND = 404

const URL_BASE = "/"
const URL_INFO = URL_BASE + "info"
const URL_API_ROOT = URL_BASE + "api/"
const URL_API_PERSONS = URL_API_ROOT + "persons"
const URL_API_SINGLE_PERSON = URL_API_PERSONS + "/:id"

const ERR_FIRST = 0
const ERR_UNKNOWN_ENDPOINT = ERR_FIRST + 0
const ERR_MALFORMATTED_ID = ERR_FIRST + 1
const ERR_ENTRY_WITH_NAME_EXISTS = ERR_FIRST + 2
const ERR_ENTRY_WITH_ID_DOES_NOT_EXIST = ERR_FIRST + 3
const ERR_NAME_TOO_SHORT = ERR_FIRST + 4
const ERR_PHONENUMBER_TOO_SHORT = ERR_FIRST + 5

let entries = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "phoneNumber": "+358 000 123 4567"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "phoneNumber": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Bart Simpson",
    "phoneNumber": "SPRINGVILLE-3599 2863"
  },
  {
    "id": 4,
    "name": "Dan Abramov",
    "phoneNumber": "12-43-234345"
  },
  {
    "id": 5,
    "name": "Darth Vader",
    "phoneNumber": "DEATHSTAR-9911 9119"
  },
  {
    "id": 6,
    "name": "James T. Kirk",
    "phoneNumber": "ENTERPRISE-000 0001"
  },
  {
    "id": 7,
    "name": "Lisa Simpson",
    "phoneNumber": "SPRINGVILLE-1291 5595"
  },
  {
    "id": 8,
    "name": "Mary Poppendieck",
    "phoneNumber": "39-23-6423122"
  },
  {
    "id": 9,
    "name": "Scrooge McDuck",
    "phoneNumber": "DUCKBURG-9588 2538"
  },
  {
    "name": "Donald Duck",
    "phoneNumber": "DUCKBURG-313 1313",
    "id": 10
  },
  {
    "name": "Gyro Gearloose",
    "phoneNumber": "DUCKBURG-999 1243 6978",
    "id": 11
  },
  {
    "name": "Roger Rabbit",
    "phoneNumber": "TOONTOWN-1928 7364",
    "id": 12
  }
]

const PersonModule = require("./models/person")
const Person = PersonModule.model

const ErrorMessages = {}
ErrorMessages[ERR_UNKNOWN_ENDPOINT] = "Unknown endpoint"
ErrorMessages[ERR_MALFORMATTED_ID] = "Malformatted ID value"
ErrorMessages[ERR_ENTRY_WITH_NAME_EXISTS] =
    "The phone book already has an entry with the given name"
ErrorMessages[ERR_ENTRY_WITH_ID_DOES_NOT_EXIST] =
    "The phone book does not contain an entry with the given name"
ErrorMessages[ERR_NAME_TOO_SHORT] =
    `The name of the person has to be at least ${PersonModule.MIN_LENGTH_NAME} characters long`
ErrorMessages[ERR_PHONENUMBER_TOO_SHORT] =
    `The phone number has to be at least ${PersonModule.MIN_LENGTH_PHONENUMBER} characters long`


console.log("Setting up HTTP server...")
const app = express()
app.use(cors())
app.use(express.static("build"))
app.use(express.json())

morgan.token(
  "content-as-json",
  function (req, res) {
    return JSON.stringify(req.body)
  }
)

function phoneBookLogFormat(
      tokens, request, response) {

  const method = tokens.method(request, response)

  let s = [
    method,
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"), "-",
    tokens["response-time"](request, response), "ms"
  ].join(" ")

  if (method.toUpperCase() === "POST") {
    s += " " + tokens["content-as-json"](request, response)
  }

  return s
}
app.use(morgan(phoneBookLogFormat))


// Handle the base URL
app.get(URL_BASE, (request, response, next) => {
  response.send("")
})

// Generate the info page
app.get(URL_INFO, (request, response, next) => {
  const nowDate = new Date()

  let content = "<h1>Phonebook Server: Status</h1>"
  content += `<div>Phonebook has info for ${entries.length} people</div>`
  content += "<br/>"
  content += `<div>${nowDate}</div>`

  response.send(content)
})

// Retrieve all entries
app.get(URL_API_PERSONS, (request, response, next) => {
  Person.find({})
    .then(entries => {
      response.json(entries)
    })
    .catch(reason => {
      console.error("Retrieving entries failed: ", reason)
    })
})

// Add an entry
app.post(URL_API_PERSONS, (request, response, next) => {
  const givenEntryData = request.body

  const entryToAdd = new Person({
    name: givenEntryData.name,
    phoneNumber: givenEntryData.phoneNumber,
  })

  entryToAdd.save()
    .then(savedEntry => response.json(savedEntry))
    .catch(error => next(error))
})

// Retrieve a single entry
app.get(URL_API_SINGLE_PERSON, (request, response, next) => {
  const idToFind = request.params.id

  Person.findById(idToFind).then(entry => {
    if (entry)
      response.json(entry)
    else
      response.status(HTTP_STATUS_NOT_FOUND).end()
  })
  .catch(error => next(error))
})

// Delete a single entry
app.delete(URL_API_SINGLE_PERSON, (request, response, next) => {
  const idToDelete = request.params.id
  entries = entries.filter(e => e.id !== idToDelete)

  response.status(HTTP_STATUS_NO_CONTENT).end()
})



const unknownEndpoint = (request, response, next) => {
  const status = HTTP_STATUS_NOT_FOUND
  const data = {
    status: status,
    errorCode: ERR_UNKNOWN_ENDPOINT,
    message: ErrorMessages.ERR_UNKNOWN_ENDPOINT,
  }
  response.status(status).send(data)
}
app.use(unknownEndpoint)



const errorHandler = (error, request, response, next) => {
  console.error(error)

  let responseStatus = undefined
  let responseData = {}
  if (error.name === "CastError") {
    if (error.kind === "ObjectId" && error.path === "_id") {
      responseStatus = HTTP_STATUS_BAD_REQUEST
      responseData = {
        status: responseStatus,
        errors: [
          {
            errorCode: ERR_MALFORMATTED_ID,
            message: ErrorMessages.ERR_MALFORMATTED_ID,
            originalError: {
              message: error.message,
              reason: error.reason.message,
              value: error.value,
            },
          }
        ],
      }
    }
  }
  else if (error.name === "ValidationError") {
    const internalErrors = Object.entries(error.errors)
    const resultErrors = []
    internalErrors.forEach(([fieldName, fieldError]) => {
      let errorCode = undefined
      const errorProps = fieldError.properties
      if (errorProps) {
        const errorKind = fieldError.kind
        if (errorProps.path === "name") {
          if (errorKind === "unique") {
            errorCode = ERR_ENTRY_WITH_NAME_EXISTS
          }
          else if (errorKind === "required" || errorKind === "minlength") {
            errorCode = ERR_NAME_TOO_SHORT
          }
        }
        else if (errorProps.path === "phoneNumber") {
          if (errorKind === "required" || errorKind === "minlength") {
            errorCode = ERR_PHONENUMBER_TOO_SHORT
          }
        }

        if (errorCode) {
          resultErrors.push({
            errorCode: errorCode,
            message: ErrorMessages[errorCode],
            value: errorProps.value,
            originalError: {
              message: errorProps.message,
              kind: errorKind,
              path: errorProps.path,
            },
          })
        }
      }
    })

    if (resultErrors.length > 0) {
      responseStatus = HTTP_STATUS_BAD_REQUEST
      responseData = {
        status: responseStatus,
        errors: resultErrors,
      }
    }
  }

  if (responseStatus) {
    return response.status(responseStatus).send(responseData)
  }

  next(error)
}
app.use(errorHandler)




app.listen(PORT_TO_LISTEN, () => {
  console.log(`Phonebook server running on port ${PORT_TO_LISTEN}.`)
})
