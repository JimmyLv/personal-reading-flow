const Express = require('express')
const Webtask = require('webtask-tools')
const bodyParser = require('body-parser')
const app = Express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// yet to be created
app.use(require('./middlewares/db').connectDisconnect)
require('./routes/stories')(app)

module.exports = Webtask.fromExpress(app)