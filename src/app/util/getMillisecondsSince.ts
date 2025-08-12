export const getMillisecondsSince = (date: Date): number => {
  return new Date().getTime() - date.getTime()
}

// put in a number of days and get milliseconds in those days
export const getMillisecondsInDays = (days: number): number => {
  return 1000 * 60 * 60 * 24 * days
}

// takes a number of days from now and returns milliseconds from *epoch*
export const getMillisecondsFromNow = (days: number): number => {
  return days === 0 ? 0 : Math.floor(Date.now()) - 60 * 60 * 24 * 1000 * days
}
