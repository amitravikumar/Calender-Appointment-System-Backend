const mongoose = require('mongoose');
const Schema = mongoose.Schema
const moment = require('moment');

const bookingSchema = new Schema({
    _bookingId: Schema.Types.ObjectId.Id,
    user: {type: Schema.ObjectId, ref: 'User'},
    bookingStart: {type:Number, required:true},
    bookingEnd: {type:Number, required:true},
    startHour: Number,
    duration: Number,
    recurring: [],
    purpose: { type: String, required: true},
    slotId: { type: Schema.ObjectId, ref: 'Slot'}
})

bookingSchema.path('bookingStart').validate(function(value){
    //Extract the slot from the query object 
    let slotId = this.slotId

    let newBookingStart = value.getTime();
    let newBookingEnd = this.bookingEnd.getTime();

    let clashesWithExisting = (existingBookingStart, existingBookingEnd, newBookingStart, newBookingEnd) => {
        if (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd || 
          existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd) {
          
          throw new Error(
            `Booking could not be saved. There is a clash with an existing booking from ${moment(existingBookingStart).format('HH:mm')} to ${moment(existingBookingEnd).format('HH:mm on LL')}`
          )
        }
        return false
      }

      //Locate the Slot document containing the booking
      return Slot.findById(roomId)
      .then(slot => {
        // Loop through each existing booking and return false if there is a clash
        return slot.bookings.every(booking => {
          
          // Convert existing booking Date objects into number values
          let existingBookingStart = new Date(booking.bookingStart).getTime()
          let existingBookingEnd = new Date(booking.bookingEnd).getTime()
  
          // Check whether there is a clash between the new booking and the existing booking
          return !clashesWithExisting(
            existingBookingStart, 
            existingBookingEnd, 
            newBookingStart, 
            newBookingEnd
          )
        })
      })
}, `{REASON}`)

const slotSchema = new Schema({
    name: { type: String, index: true, required: true },
    time: { type: String, index: true, required: true },
    contactNo: { type: Number, required: true },
    bookings: [bookingSchema]
})

const Slot = (module.export = mongoose.model('Slot', slotSchema))