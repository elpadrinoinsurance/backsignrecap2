const roles = {
    OPERATIVO: 'OPERATIVO',
    ADMIN: 'ADMIN'
}

const HOUR = 24
const MIN = 60
const SEC = 60
const MS = 1000
const DAY = HOUR * MIN * SEC * MS
const MAX_TIME_DAYS = 7


module.exports = {
  roles,
  DAY,
  MAX_TIME_DAYS
}