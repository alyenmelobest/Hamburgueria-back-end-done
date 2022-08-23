const { response, request, json } = require('express')
const express = require('express')
const uuid = require('uuid')
const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(clientId => clientId.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order Not Found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}
const requests = (request, response, next) => {
    const method = request.route.methods
    const url = request.route.path
    console.log(method, url)

    next()
}

app.post('/orders', requests, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"

    const clientId = { id: uuid.v4(), order, clientName, price, status }
    orders.push(clientId)

    return response.status(201).json(clientId)
})

app.get('/orders', requests, (request, response) => {

    return response.json(orders)
})

app.put('/orders/:id', checkUserId, requests, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const id = request.userId
    const index = request.userIndex

    const updatedUser = { id, order, clientName, price, status }

    orders[index] = updatedUser

    return response.json(updatedUser)

})

app.delete('/orders/:id', checkUserId, requests, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json(orders)
})
app.get('/orders/:id', checkUserId, requests, (request, response) => {
    const index = request.userIndex
    const order = orders[index]

    return response.json(order)
})
app.patch('/orders/:id', checkUserId, requests, (request, response) => {
    const index = request.userIndex
    const { id, clientName, order, price } = orders[index]
    let status = orders[index].status
    status = "Pedido Pronto"
    const finishedOrder = { id, order, clientName, price, status }
    orders[index] = finishedOrder

    return response.json(finishedOrder)
})


app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})
