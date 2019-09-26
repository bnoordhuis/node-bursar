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

### rsaPrivateKey.pkcs1(options)

Like `rsaPrivateKey()` but the result is returned as a PKCS#1-encoded string.

### rsaPrivateKey.pkcs8(options)

Like `rsaPrivateKey()` but the result is returned as a PKCS#8-encoded string.

### rsaPublicKey(options)

* `options` {Object}
  - `modulus` {BigInt|Buffer|Uint8Array} RSA `n` parameter.
  - `publicExponent` {BigInt|Buffer|Uint8Array} RSA `e` parameter.
* Returns: {Array} BER-encoded RSA public key.

### rsaPublicKey.pkcs1(options)

Like `rsaPublicKey()` but the result is returned as a PKCS#1-encoded string.

### rsaPublicKey.pkcs8(options)

Like `rsaPublicKey()` but the result is returned as a PKCS#8-encoded string.
