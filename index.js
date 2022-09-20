const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routers/authRouter')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
    try {
        mongoose.connect('mongodb+srv://Aydar:Aydar@cluster0.bied5nr.mongodb.net/?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))
    }catch (e) {
        console.log(e)
    }
}

start()