import moment from 'moment'

function date (value) {
  if (value) {
    return moment(String(value)).format('YYYY/MM/DD HH:mm')
  }
}

function mediaTitle (path) {
  let idx = path.lastIndexOf('/')
  return path.substring(idx + 1)
}

export {
  date,
  mediaTitle
}
