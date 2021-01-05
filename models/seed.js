const Slot = require('./Slot')

Slot.create([
  {
    name: 'Slot 1',
    time: '9:00',
    contactNo: 18,
  },
  {
    name: 'Slot 2',
    time: '9:30',
    contactNo: 18,
  },
  {
    name: 'Slot 3',
    time: '10:00',
    contactNo: 18,
  },
  {
    name: 'Slot 4',
    time: '10:30',
    contactNo: 18,
  },{
    name: 'Slot 5',
    time: '11:00',
    contactNo: 18,
  },{
    name: 'Slot 6',
    time: '11:30',
    contactNo: 18,
  },{
    name: 'Slot 7',
    time: '12:00',
    contactNo: 18,
  },{
    name: 'Slot 8',
    time: '12:30',
    contactNo: 18,
  },{
    name: 'Slot 9',
    time: '13:00',
    contactNo: 18,
  },{
    name: 'Slot 10',
    time: '13:30',
    contactNo: 18,
  },{
    name: 'Slot 11',
    time: '14:00',
    contactNo: 18,
  },{
    name: 'Slot 12',
    time: '14:30',
    contactNo: 18,
  },{
    name: 'Slot 13',
    time: '15:00',
    contactNo: 18,
  },{
    name: 'Slot 14',
    time: '15:30',
    contactNo: 18,
  },{
    name: 'Slot 15',
    time: '16:00',
    contactNo: 18,
  },{
    name: 'Slot 16',
    time: '16:30',
    contactNo: 18,
  }
]).then((slots) => {
    console.log(`Created ${slots.length} slots`);
}).catch((error) => {
    console.error(error)
})