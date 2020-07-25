const deleteSchedule = function (req, res, User) {
  const { id: _id } = req.params
  User.updateOne({ _id }, { $set: { eventSchedule: null } }).then((result) => {
    console.log(result)
    res.status(201).send(result)
  })
    .catch(err => {
      res.status(500).send(err.message)
    })
}

module.exports = deleteSchedule
