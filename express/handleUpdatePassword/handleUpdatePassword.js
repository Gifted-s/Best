module.exports = async function changePassword (req, res, next, User, bcrypt) {
  let value = true
  await User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      return res.status(400).send({
        error: err.message,
        status: 'failed'
      })
    }
    const checkPassword = async function () {
      return bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      )
    }
    checkPassword().then(result => {
      if (result) {
        user.password = bcrypt.hashSync(
          req.body.newPassword,
          bcrypt.genSaltSync(10),
          null
        )
        user
          .save()
          .then((response) => {
            console.log(response)
            value = true
          })
          .catch((err) => {
            console.log(err.message)
            return res.status(400).send({
              status: 'failed',
              error: err.message
            })
          })
      } else {
        value = false
      }
    })
  })

  return value
}
