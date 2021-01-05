const Slot = require('./Slot')
const User = require('./User')

Slot.deleteMany()
  .then(() => {
    console.log('Deleted slots')
    process.exit()
  })

User.deleteMany()
  .then(() => {
    console.log('Deleted users')
    process.exit()
  })