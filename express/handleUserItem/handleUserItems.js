// this module will update users items
/**
 * handleUpdateEvent
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const handleUserItems = function (req, res, User) {
  console.log(req.body)
  // update the user eventSchedule field
  // find the user by id and execute the callback
  User.findById({ _id: req.params.id }, (err, user_) => {
    // throw error if it occurs
    if (err) throw err
    // push the event scheduled to user record

    user_.userItems.push({ ...req.body })

    // save to database
    user_.save().then((result) => {
      res.status(200).send({ result: result.userItems[result.userItems.length - 1] })
    })
  })
}
// export function for further usage
module.exports = handleUserItems
