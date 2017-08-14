import moment from 'moment'

function date (value) {
  if (value) {
    return moment(String(value)).format('YYYY/MM/DD HH:mm')
  }
}

export {
  date
}
