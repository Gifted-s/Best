
const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const handlePresent = require('./handlePresent/handlePresent')
const handleUserItems = require('./handleUserItem/handleUserItems')
const deleteSchedule = require('./handleDeleteSchedule/deleteSchedule')
const handleValidation = require('./handleEmailValidation/validation')
const handleUserSignup = require('./handleUserSignup/signup')
const handleUserSignin = require('./handleSignin/handleSignin')
const handleAddProduct = require('./handleAddProduct/addProduct')
const handleFetchProducts = require('./handleFetchProducts/handleFetchProducts')
const handleUpdateEvent = require('./handleUpdateEvent/handleUpdateEvent')
const handleForgotPassword = require('./handleForgotPassword/handleForgotPassword')
const handleEditProfile = require('./handleEditProfile/handleEditProfile')
const handleGetUser = require('./handleGetUser/handleGetUser')
const handlePayment = require('./handlePayment/handlePayment')
const path = require('path')
const bcrypt = require('bcryptjs')
const Product = require('./models/Product')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const helmet = require('helmet')
const User = require('./models/User')
const serverless = require('serverless-http')
global.Promise = mongoose.Promise
mongoose.connect('mongodb://sunkanmi:sunkanmi123@ds233167.mlab.com:33167/mmd', { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true }, () => {
console.log('connected to mongodb')
})

router.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(helmet())

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/validate-email/:id', (req, res) => {
  handleValidation(req, res, User)
})

router.post('/signup', (req, res) => {
  handleUserSignup(req, res, User)
})
router.post('/signin', (req, res) => {
  handleUserSignin(req, res, User)
})

router.post('/addProduct', (req, res) => {
  handleAddProduct(req, res, Product)
})
router.get('/getProducts', (req, res) => {
  handleFetchProducts(req, res, Product)
})

router.post('/handleItem/:id', (req, res) => {
  handleUpdateEvent(req, res, User)
})

router.post('/forgot', (req, res, next) => {
  handleForgotPassword(req, res, User, bcrypt)
})

router.post('/edit', (req, res, next) => {
  handleEditProfile(req, res, next, User, bcrypt)
})

router.get('/getUser/:id', (req, res) => {
  handleGetUser(req, res, User)
})

router.post('/makePayment', (req, res) => {
  handlePayment(req, res, User, uuidv4)
})

router.delete('/deleteSchedule/:id', (req, res) => {
  deleteSchedule(req, res, User)
})

router.post('/handleUserItems/:id', (req, res) => {
  handleUserItems(req, res, User)
})

router.post('/handlepresent/:id/:record_id', (req, res) => {
  handlePresent(req, res, User)
})
app.get('/', (req, res) =>  res.send('hello world'));
app.use('/.netlify/functions/app', router);  // path must route to lambda
module.exports = app
module.exports.handler = serverless(app)

