const PORT_TO_LISTEN = process.env.PORT || 3001

const entries = [
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

const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("")
})

app.get("/info", (req, res) => {
  const nowDate = new Date()

  let content = "<h1>Phonebook Server: Status</h1>"
  content += `<div>Phonebook has info for ${entries.length} people</div>`
  content += "<br/>"
  content += `<div>${nowDate}</div>`

  res.send(content)
})

app.get("/api/persons", (req, res) => {
  res.json(entries)
})

app.listen(PORT_TO_LISTEN, () => {
  console.log(`Phonebook server running on port ${PORT_TO_LISTEN}.`)
})
