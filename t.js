const {randomBytes} = require('crypto')

function randomBits(n) {
  const t = n >>> 3
  const u = n & 7
  const b = randomBytes(t + !!u)
  if (u > 0) b[t] &= (1 << u) - 1
  return b
}

console.log(randomBits(9))
