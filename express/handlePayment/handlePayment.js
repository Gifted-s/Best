
// this module will handle the payment using the paystack
// let PayStack = require('paystack-node')
// let APIKEY = process.env.PAYSTACK_SECRET_KEY
// let APIKEY = 'sk_test_374f2723a175f17c96481cae603dad29906a952a'
// const environment = process.env.NODE_ENV
// const paystack = new PayStack(APIKEY, environment)
var Ravepay = require('flutterwave-node');

var rave = new Ravepay("FLWPUBK_TEST-b5440b6a7b601887fbe55ac82d5d6304-X", "FLWSECK_TEST-9f158f5ea8116153c1e38e713c9415dd-X", false);
/**
 *
 *handlePayment function
 * @param {Object} req , request from client
 * @param {Object} res  , response to user
 * @param {Constructor} User
 * @param {Function} uuidv4
 */
const handlePayment = function (req, res, User, uuidv4) {
  const _idd = req.body.id
      const { cardno,
        cvv,
        expirymonth,
        expiryyear,
        currency,
        country,
        amount,
        email,
        firstname,
        lastname}
        = req.body

      // console.log(
      //   {
      //   cardno,
      //   cvv,
      //   expirymonth,
      //   expiryyear,
      //   currency,
      //   country,
      //   amount,
      //   email,
      //   firstname,
      //   lastname
      //   }
      // )
  /**
   * find the user by id and execute the callback function
   */
  User.findById({ _id: _idd }, (err, user) => {
    // if an error throw it
    if (err) throw err
    // generate random unique id
    // const verificationCode = uuidv4()
    // // initialize payment
    // const promise6 = paystack.initializeTransaction({
    //   reference: verificationCode, // verification number
    //   amount: req.body.totalPrice * 100, //  Naira ( amount is passed in kobo ( 1 Naira make 100 Kobo) )
    //   email: user.email,
    //   callback_url: `https://makemyday.netlify.app/event/${_idd}/${req.body.prevEvent._id}`
    //   // callback_url: `https://makemyday.netlify.app/event/${_idd}/${req.params.id}`
    // })

    rave.Card.charge(
      {
        "cardno": "5438898014560229",
        "cvv": "564",
        "expirymonth": "10",
        "expiryyear": "20",
        "currency": "NGN",
        "country": "NG",
        "amount": amount ?amount:10000,
        "email":email ? email: "test@gmail.com",
        "phonenumber": "0902620185",
        "firstname": firstname ? firstname: "testfirstname",
        "lastname": lastname ? lastname:"TestLastname",
        "IP": req.ip,
        "txRef": "MC-" + Date.now(),// your unique merchant reference
        "meta": [{ metaname: "donaterID", metavalue: "123949494DC" }],
        "redirect_url": `https://makemyday.netlify.app/event/${_idd}/${req.body.prevEvent._id}`,
      }
    ).then(resp => {
       console.log(resp.body)
      // let verifyInterval = setInterval(verify, 1000 * 60 * 1)
      // function verify() {
      //   console.log('called')
        rave.Card.validate({
          "transaction_reference": resp.body.data.flwRef,
          "otp": 123456
        }).then(response => {
          if (response.body.data.tx.status === 'successful') {
            console.log('transaction successful')
            activateAfterPaymentSuccesssful(response.body.data.tx)
            // clearInterval(verifyInterval)
          }


        })
      // }

      // // stop verifing payment after 15 minutes
      // setTimeout(stopVerification, 1000 * 60 * 15)
      // // this function will stop verification of payment
      // function stopVerification() {
      //   clearInterval(verifyInterval)
      // }


    }).catch(err => {
      // console.log(err);
      res.status(400).send({ error: err.message })

    })

    function activateAfterPaymentSuccesssful(response) {
      const eventFound = user.record.find(function (item) {
        return item._id == req.body.prevEvent._id
      })

      // let { prevEvent: newItem, ...updatedEventDetails } = req.body
      // const updatedEvent = { ...eventFound, ...updatedEventDetails }
      // console.log({ ...eventFound }, updatedEventDetails, 'for update')
      if (eventFound) {
        eventFound.noOfContributors += 1
        eventFound.amountRecieved = req.body.totalPrice + eventFound.amountRecieved
        eventFound.totalPrice -= req.body.totalPrice
        eventFound.totalQty -= req.body.totalQty
        for (let i = 0; i < eventFound.items.length; i++) {
          for (let j = 0; j < req.body.cartItems.length; j++) {
            if (eventFound.items[i].item._id === req.body.cartItems[j].item._id) {
              eventFound.items[i].price = eventFound.items[i].price - req.body.cartItems[j].price
              eventFound.items[i].qty = eventFound.items[i].qty - req.body.cartItems[j].qty
            }
          }
        }
        User.updateOne({ _id: _idd }, { $set: { record: user.record } }).then(() => {

        })
      }

      // save the new items needed to database
      user.save().then((response) => {
      })
      // send payment page url to client, this will redirect user to payment page
      res.status(200).send({ redirectUrl: response.redirectUrl })

      // after payment page url is sent  to client start checking if the user the has paid with an
      // interval of 1 minute
      // var verifyChunk = setInterval(verifyPayment, 1000 * 60 * 1)
      /**
       * the verifyPayment function will check if the user has paid successfully
       */
      // function verifyPayment () {
      //   const promise7 = paystack.verifyTransaction({
      //     reference: verificationCode
      //   })

      // promise7.then(function (response) {
      //   // checking if the payment was successful
      //   if (response.body.data.status === 'success') {
      var nodemailer = require('nodemailer')
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          // user: process.env.GMAIL_USER,
          // pass: process.env.GMAIL_PASS
          user: "sunkanmiadewumi1@gmail.com",
          pass: 'Ayodeji00;'
        }
      })

      let helperfunction = {

        from: '"Makemyday" <sunkanmiadewumi1@gmail.com',
        to: user.email,
        subject: 'Payment recieved',
        html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
                <p style="font-size:15px;line-height:1.5em">Hi ${user.name}, <b>${req.body.name ? req.body.name : 'Someone'}</b> just contributed to your event by paying a sum of ₦${req.body.totalPrice} for ${req.body.totalQty} items needed for your event, you will recieve payment from Makemyday shortly</p>
          
              `

      }
      // send mail to notify user that someone just paid
      transporter.sendMail(helperfunction, (err, info) => {
        if (err) {
          // check if an error occur and log it to console
          console.log(err)
        }
      })
      if (req.body.email && req.body.email) {
        let transporter2 = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            // user: process.env.GMAIL_USER,
            // pass: process.env.GMAIL_PASS
            user: "sunkanmiadewumi1@gmail.com",
            pass: 'Ayodeji00;'
          }
        })

        let helperfnc = {

          from: '"Makemyday" <sunkanmiadewumi1@gmail.com',
          to: req.body.email,
          subject: 'Transaction successful',
          html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
                <p style="font-size:15px;line-height:1.5em">Hi ${req.body.name}, <b>${user.name}</b> just recieved your payment of ₦${req.body.totalPrice}. Thank you for your contribution</p>
          
              `

        }
        // send an email to user verify email account
        transporter2.sendMail(helperfnc, (err, info) => {
          if (err) {
            // check if an error occur and log it to console
            console.log(err)
          }
        })
      }

      // if payment is successfull then  should stop verification
      // clearInterval(verifyChunk)
    }
  }).catch(function (error) {
    console.log(error)
  })
}
// export function for further usage
module.exports = handlePayment
