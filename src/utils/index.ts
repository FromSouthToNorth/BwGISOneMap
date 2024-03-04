export function utilStringQs(str: string): any {
  let i = 0
  while (i < str.length && (str[i] === '?' || str[i] === '#')) i++
  str = str.slice(i)

  return str.split('&').reduce((obj: any, pair: string) => {
    const parts = pair.split('=')
    if (parts.length === 2)
      obj[parts[0]] = parts[1] === null ? '' : decodeURIComponent(parts[1])

    return obj
  }, {})
}

export function utilQsString(obj: any, noencode: boolean): string {
  // encode everything except special characters used in certain hash parameters:
  // "/" in map states, ":", ",", {" and "}" in background
  function softEncode(s: string) {
    return encodeURIComponent(s).replace(/(%2F|%3A|%2C|%7B|%7D)/g, decodeURIComponent)
  }

  return Object.keys(obj)
    .sort()
    .map((key) => {
      return `${encodeURIComponent(key)}=${
        noencode ? softEncode(obj[key]) : encodeURIComponent(obj[key])
      }`
    })
    .join('&')
}
