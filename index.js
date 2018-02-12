const express = require('express')
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :req-body :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2,
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3,
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4,
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(p => p.id === id)

  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// return number between 1 and 10000000000000
const generateId = () => {
  const max = 9999999999999
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  if ( body.name === undefined || body.number === undefined ) {
    return response.status(400).json({error: 'name or number missing'})
  }

  const existing_person_with_same_name = persons.find(person => person.name === body.name)

  if ( existing_person_with_same_name ) {
    return response.status(409).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

app.get("/info", (request, response) => {
  response.send(
    `
    <p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p>${new Date()}</p>
    `
  )
})

const error = (request, response, next) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
