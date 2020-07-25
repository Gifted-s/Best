// this module will update users eventSchedule details
/**
 * handleUpdateEvent
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const mongoose = require('mongoose')
const handleUpdateEvent = function (req, res, User) {
  console.log('here is called')
  // update the user eventSchedule field
  // find the user by id and execute the callback
  User.findById({ _id: req.params.id }, (err, user_) => {
    // throw error if it occurs
    if (err) throw err
    // push the event scheduled to user record

    if (req.body.prevEvent) {
      const eventFound = user_.record.find(function (item) {
        return item._id == req.body.prevEvent._id
      })
      if (eventFound) {
        eventFound.eventName = req.body.eventName
        eventFound.imageUrl = req.body.imageUrl
        eventFound.eventDate = req.body.eventDate
        eventFound.items = req.body.items
        eventFound.totalPrice = req.body.totalPrice
        eventFound.totalQty = req.body.totalQty
        User.updateOne({ _id: req.params.id }, { $set: { record: user_.record } }).then(() => {
        })
      }
    } else {
      user_.record.push({ ...req.body, _id: new mongoose.Types.ObjectId(), noOfContributors: 0, noPresent: 0, expectedPrice: req.body.totalPrice, amountRecieved: 0 })
      user_.save().then((resp) => {
        res.status(200).send({ _id: resp.record[resp.record.length - 1]._id })
      })
    }

    // save to database

  })
}
// export function for further usage
module.exports = handleUpdateEvent
