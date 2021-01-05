const express = require('express');
const moment = require('moment');
const momentTimeZone = require('moment-time-zone');
const Slot = require('../models/Slot');
const { requireJWT } = require('../middleware/auth');

const router = new express.Router();

router.get('/slots', requireJWT, (req, res) => {
    Slot.find()
        .then(slots => {
            res.json(slots);
        })
        .catch(error => {
            res.json({ error })
        })
})


router.post('/slots', requireJWT, (req, res) => {
    Slot.create(req.body)
        .then(slot => {
            res.status(200).json(slot)
        })
        .catch(error => {
            res.status(422).json({ error })
        })
})


function toTimeZone(time, zone) {
    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    return moment(time, format).tz(zone).format(format);
}

const durationHours = (bookingStart, bookingEnd) => {

    let startDateLocal = toTimeZone(bookingStart);
    let endDateLocal = toTimeZone(bookingEnd);

    let difference = moment.duration(endDateLocal.diff(startDateLocal))
}

//Make a booking 
router.put('./slots/:id', requireJWT, (req, res) => {
    const id = req.params

    if(req.body.recurring.length === 0){
        Slot.findByAndUpdate(
            id,
            {
                $addToSet: {
                    bookings: {
                        user: req.user,

                        startHour: toTimeZone(req.body.bookingStart).format('HH:mm'),

                        duration: durationHours(req.body.bookingStart, req.body.bookingEnd),

                        ...req.body
                    }
                }
            }, 
            { new: true, runValidators: true, context: 'query'}
        )
            .then(slot => {
                res.status(200).json(slot)
            })
            .catch(error => {
                res.status(422).json({ error })
            })


    } let firstBooking = req.body
    firstBooking.user = req.user    
    firstBooking.startHour = dateAEST(req.body.bookingStart).format('H.mm')
    firstBooking.duration = durationHours(req.body.bookingStart, req.body.bookingEnd)
    
    // An array containing the first booking, to which all additional bookings in the recurring range will be added
    let recurringBookings = [ firstBooking ]
    
    // A Moment.js object to track each date in the recurring range, initialised with the first date
    let bookingDateTracker = momentTimezone(firstBooking.bookingStart).tz('IST')
    
    // A Moment.js date object for the final booking date in the recurring booking range - set to one hour ahead of the first booking - to calculate the number of days/weeks/months between the first and last bookings when rounded down
    let lastBookingDate = momentTimezone(firstBooking.recurring[0]).tz('IST')
    lastBookingDate.hour(bookingDateTracker.hour() + 1)
    
    // The number of subsequent bookings in the recurring booking date range 
    let bookingsInRange = req.body.recurring[1] === 'daily' ? 
                          Math.floor(lastBookingDate.diff(bookingDateTracker, 'days', true)) :
                          req.body.recurring[1] === 'weekly' ?
                          Math.floor(lastBookingDate.diff(bookingDateTracker, 'weeks', true)) :
                          Math.floor(lastBookingDate.diff(bookingDateTracker, 'months', true))

    // Set the units which will be added to the bookingDateTracker - days, weeks or months
    let units = req.body.recurring[1] === 'daily' ? 'd' : 
                req.body.recurring[1] === 'weekly' ? 'w' : 'M'
    
    // Each loop will represent a potential booking in this range 
    for (let i = 0; i < bookingsInRange; i++) {
      
      // Add one unit to the booking tracker to get the date of the potential booking
      let proposedBookingDateStart = bookingDateTracker.add(1, units)
    
      // Check whether this day is a Sunday (no bookings on Sundays)
      if (proposedBookingDateStart.day() !== 0) {
        
        // Create a new booking object based on the first booking 
        let newBooking = Object.assign({}, firstBooking)
        
        // Calculate the end date/time of the new booking by adding the number of units to the first booking's end date/time
        let firstBookingEndDate = momentTimezone(firstBooking.bookingEnd).tz('IST')
        let proposedBookingDateEnd = firstBookingEndDate.add(i + 1, units)
        
        // Update the new booking object's start and end dates
        newBooking.bookingStart = proposedBookingDateStart.toDate()
        newBooking.bookingEnd = proposedBookingDateEnd.toDate()
        
        // Add the new booking to the recurring booking array
        recurringBookings.push(newBooking)
      }
    }
    

    // Find the relevant slot and save the bookings
    Slot.findByIdAndUpdate(
      id,
      {
        $push: {
          bookings: {
            $each:
            recurringBookings
          }
        }
      },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(slot => {
        res.status(200).json(slot)
      })
      .catch(error => {
        res.status(422).json({ error })
      })
  }
)

//Deleting the bookings
router.delete('/slots/:id/:bookingId', requireJWT, (req, res) => {
    const { id } = req.params
    const {bookingId} = req.params
    Slot.findByAndUpdate(
        id,
        { $pull: { bookings: { _id: bookingId } } },
        { new: true }
      )
        .then(slot => {
          res.status(201).json(slot)
        })
        .catch(error => {
          res.status(400).json({ error })
    })
})

module.exports = router