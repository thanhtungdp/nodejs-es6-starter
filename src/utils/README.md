# Helper functions

Create utils example

```javascript
// file utils/math.js

export function total(a, b) {
  return a + b
}

export function pow(a, b) {
  return a * b
}

export default {
  total,
  pow
}

// Other file like authRoute.js
import math from 'utils/math'
console.log(math.total(5, 6))

```