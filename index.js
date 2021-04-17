const http = require("http")

const app = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"})
  response.end("Hoi maailma!")
})

const port = 3001
app.listen(port)

console.log(`Phonebook server running on port ${port}.`)
