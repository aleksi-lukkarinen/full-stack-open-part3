const PORT_TO_LISTEN = process.env.PORT || 3001

const HTTP_STATUS_NO_CONTENT = 204
const HTTP_STATUS_BAD_REQUEST = 400
const HTTP_STATUS_NOT_FOUND = 404

const URL_BASE = "/"
const URL_INFO = URL_BASE + "info"
const URL_API_ROOT = URL_BASE + "api/"
const URL_API_PERSONS = URL_API_ROOT + "persons"
const URL_API_SINGLE_PERSON = URL_API_PERSONS + "/:id"

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

function generateEntryId() {
  // An horrible way of generating IDs!!!! I wash my hands...
  const usedIds = entries.map(e => e.id)
  let idCandidate = 0
  do {
    idCandidate = Math.floor(Math.random() * Number.MAX_VALUE)
  } while (usedIds.findIndex(i => i === idCandidate) >= 0)

  return idCandidate
}

function validateNonEmptyString(plainTextName, value) {
  // returns [strErr, cleanedString]

  function errorState(name, error) {
    let n = name.trim()
    n = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()

    return [`${n} ${error.trim()}`, ""]
  }

  if (!value)
    return errorState(plainTextName, "is missing")

  if (typeof(value) !== "string")
    return errorState(plainTextName, "is not a string")

  const cleanedString = value.trim()
  if (cleanedString < 1)
    return errorState(plainTextName, "is empty")

  return ["", cleanedString]
}

function findResourceIdFrom(request) {
  return parseInt(request.params.id)
}

function findEntryByUsingIdFrom(request) {
  const idToFind = findResourceIdFrom(request)
  return entries.find(e => e.id === idToFind)
}

const express = require("express")
const app = express()

app.use(express.json())


// Handle the base URL
app.get(URL_BASE, (req, res) => {
  res.send("")
})

// Generate the info page
app.get(URL_INFO, (req, res) => {
  const nowDate = new Date()

  let content = "<h1>Phonebook Server: Status</h1>"
  content += `<div>Phonebook has info for ${entries.length} people</div>`
  content += "<br/>"
  content += `<div>${nowDate}</div>`

  res.send(content)
})

// Retrieve all entries
app.get(URL_API_PERSONS, (req, res) => {
  res.json(entries)
})

// Add an entry
app.post(URL_API_PERSONS, (req, res) => {
  const givenEntryData = req.body

  let [strErr, cleanedName] =
        validateNonEmptyString("name", givenEntryData.name)
  let cleanedPhoneNumber = ""
  if (strErr.length < 1) {
    [strErr, cleanedPhoneNumber] =
        validateNonEmptyString("phone number", givenEntryData.phoneNumber)
  }
  if (strErr.length < 1) {
    const lowercaseName = cleanedName.toLowerCase()
    const existingEntry = entries.find(entry =>
      entry.name.toLowerCase() === lowercaseName)

    if (existingEntry) {
      strErr = "An entry with the given name exists already"
    }
  }
  if (strErr.length > 0) {
    return res.status(HTTP_STATUS_BAD_REQUEST).json({
      error: strErr
    })
  }

  const entryToAdd = {
    id: generateEntryId(),
    name: cleanedName,
    phoneNumber: cleanedPhoneNumber,
  }

  entries = entries.concat(entryToAdd)

  res.json(entryToAdd)
})

// Retrieve a single entry
app.get(URL_API_SINGLE_PERSON, (req, res) => {
  const entry = findEntryByUsingIdFrom(req)

  if (entry) {
    res.json(entry)
  }
  else {
    res.status(HTTP_STATUS_NOT_FOUND).end()
  }
})

// Delete a single entry
app.delete(URL_API_SINGLE_PERSON, (req, res) => {
  const idToDelete = findResourceIdFrom(req)
  entries = entries.filter(e => e.id !== idToDelete)

  res.status(HTTP_STATUS_NO_CONTENT).end()
})



app.listen(PORT_TO_LISTEN, () => {
  console.log(`Phonebook server running on port ${PORT_TO_LISTEN}.`)
})
