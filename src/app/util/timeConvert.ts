export const getMMDDYYYY = (timeStamp: number | string) => {
  const date = new Date(timeStamp)
  const day = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  const mmddyyyy = month + '/' + day + '/' + year
  return mmddyyyy
}
