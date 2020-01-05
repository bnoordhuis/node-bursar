Generate RSA keys in PKCS#1, PKCS#8 or BER format.

Long-form PKCS#1 field names are used for parameter names, not their
(rather terse) RSA counterparts.

### rsaPrivateKey(options)

* `options` {Object}
  - `modulus` {BigInt|Buffer|Uint8Array} RSA `n` parameter.
  - `publicExponent` {BigInt|Buffer|Uint8Array} RSA `e` parameter.
  - `privateExponent` {BigInt|Buffer|Uint8Array} RSA `d` parameter.
  - `prime1` {BigInt|Buffer|Uint8Array} RSA `p` parameter.
  - `prime2` {BigInt|Buffer|Uint8Array} RSA `q` parameter.
  - `exponent1` {BigInt|Buffer|Uint8Array} RSA `dp` parameter, `d % (p - 1)`.
  - `exponent2` {BigInt|Buffer|Uint8Array} RSA `dq` parameter, `d % (q - 1)`.
  - `coefficient` {BigInt|Buffer|Uint8Array}
    RSA `inverseQ` parameter, `q * inverseQ === 1 % p`.
* Returns: {Array} BER-encoded RSA private key.

Keep `prime1`, `prime2` and `privateExponent` secure at all times; the security
of the private key depends on it.

Example:
```js
const {rsaPrivateKey} = require('bursar')
const modulus = 0xBAD5ECn	// insecure; example only
const publicExponent = 0x2n
const privateExponent = 0xBAD5ECn
const prime1 = 0xBAD5ECn
const prime2 = 0xBAD5ECn
const exponent1 = 0xBAD5ECn
const exponent2 = 0xBAD5ECn
const coefficient = 0xBAD5ECn
const options = {modulus, publicExponent, privateExponent, prime1, prime2, exponent1, exponent2, coefficient}
const key = rsaPrivateKey(options)
console.log(key)
// <Buffer 30 30 02 01 00 02 04 00 ba d5 ec 02 01 02 02 04 00 ba d5 ec 02 04 00
// ba d5 ec 02 04 00 ba d5 ec 02 04 00 ba d5 ec 02 04 00 ba d5 ec 02 04 00 ba d5
// ec>
```

### rsaPrivateKey.pkcs1(options)

Like `rsaPrivateKey()` but the result is returned as a PKCS#1-encoded string.

Example:
```js
const {rsaPrivateKey} = require('bursar')
const modulus = 0xBAD5ECn	// insecure; example only
const publicExponent = 0x2n
const privateExponent = 0xBAD5ECn
const prime1 = 0xBAD5ECn
const prime2 = 0xBAD5ECn
const exponent1 = 0xBAD5ECn
const exponent2 = 0xBAD5ECn
const coefficient = 0xBAD5ECn
const options = {modulus, publicExponent, privateExponent, prime1, prime2, exponent1, exponent2, coefficient}
const key = rsaPrivateKey.pkcs1(options)
console.log(key)
// -----BEGIN RSA PRIVATE KEY-----
// MDACAQACBAC61ewCAQICBAC61ewCBAC61ewCBAC61ewCBAC61ewCBAC61ewCBAC6
// 1ew=
// -----END RSA PRIVATE KEY-----
```

### rsaPrivateKey.pkcs8(options)

Like `rsaPrivateKey()` but the result is returned as a PKCS#8-encoded string.

Example:
```js
const {rsaPrivateKey} = require('bursar')
const modulus = 0xBAD5ECn	// insecure; example only
const publicExponent = 0x2n
const privateExponent = 0xBAD5ECn
const prime1 = 0xBAD5ECn
const prime2 = 0xBAD5ECn
const exponent1 = 0xBAD5ECn
const exponent2 = 0xBAD5ECn
const coefficient = 0xBAD5ECn
const options = {modulus, publicExponent, privateExponent, prime1, prime2, exponent1, exponent2, coefficient}
const key = rsaPrivateKey.pkcs8(options)
console.log(key)
// -----BEGIN PRIVATE KEY-----
// MEYCAQAwDQYJKoZIhvcNAQEBBQAEMjAwAgEAAgQAutXsAgECAgQAutXsAgQAutXs
// AgQAutXsAgQAutXsAgQAutXsAgQAutXs
// -----END PRIVATE KEY-----
```

### rsaPublicKey(options)

* `options` {Object}
  - `modulus` {BigInt|Buffer|Uint8Array} RSA `n` parameter.
  - `publicExponent` {BigInt|Buffer|Uint8Array} RSA `e` parameter.
* Returns: {Array} BER-encoded RSA public key.

Example:
```js
const {rsaPublicKey} = require('bursar')
const modulus = 0xBAD5ECn	// insecure; example only
const publicExponent = 0x2n
const key = rsaPublicKey({modulus, publicExponent})
console.log(Buffer.from(key))
// <Buffer 30 09 02 04 00 b4 d5 ec 02 01 02>
```

### rsaPublicKey.pkcs1(options)

Like `rsaPublicKey()` but the result is returned as a PKCS#1-encoded string.

Example:
```js
const {rsaPublicKey} = require('bursar')
const modulus = 0xBAD5ECn	// insecure; example only
const publicExponent = 0x2n
const key = rsaPublicKey.pkcs1({modulus, publicExponent})
console.log(key)
// -----BEGIN RSA PUBLIC KEY-----
// MAkCBAC01ewCAQI=
// -----END RSA PUBLIC KEY-----
```

### rsaPublicKey.pkcs8(options)

Like `rsaPublicKey()` but the result is returned as a PKCS#8-encoded string.

Example:
```js
const {rsaPublicKey} = require('bursar')
const modulus = 0xBAD5ECn	// insecure; example only
const publicExponent = 0x2n
const key = rsaPublicKey.pkcs8({modulus, publicExponent})
console.log(key)
// -----BEGIN PUBLIC KEY-----
// MB0wDQYJKoZIhvcNAQEBBQADDAAwCQIEALTV7AIBAg==
// -----END PUBLIC KEY-----
```

<hr>

### changelog

#### v0.0.3 05/01/2020

* add examples to README

#### v0.0.2 04/01/2020

* implement missing `rsaPrivateKey.pkcs8()`

#### v0.0.1 04/01/2020

* initial release
