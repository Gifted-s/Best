// this module will update users eventSchedule details
/**
 * handleUpdateEvent
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const handlePresent = function (req, res, User) {
  // update the user eventSchedule field
  // find the user by id and execute the callback
  User.findById({ _id: req.params.id }, (err, user_) => {
    if (err) throw err
    if (!user_) {
      console.log('an error occured no user with this id')
      return res.status(200).send({ message: 'This event no longer exist' })
    }
    const eventFound = user_.record.find(function (item) {
      return item._id == req.params.record_id
    })
    if (eventFound) {
      eventFound.noPresent += 1
      User.updateOne({ _id: req.params.id }, { $set: { record: user_.record } }).then((result) => {
        res.status(200).send({ result: result.nModified })
      })
    }
  })
}
// export function for further usage
module.exports = handlePresent
