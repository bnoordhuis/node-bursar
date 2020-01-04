'use strict'

if (typeof module === 'object' && module && module.exports)
	module.exports = {rsaPrivateKey, rsaPublicKey}

// RSAPrivateKey :::= SEQUENCE {
// 	version Version, -- always 0
// 	modulus INTEGER,
// 	publicExponent INTEGER,
// 	privateExponent INTEGER,
// 	prime1 INTEGER,
// 	prime2 INTEGER,
// 	exponent1 INTEGER,
// 	exponent2 INTEGER,
// 	coefficient INTEGER,
// 	otherPrimeInfos OtherPrimeInfos OPTIONAL, -- omitted
// }
function rsaPrivateKey(options) {
	let {modulus, publicExponent, privateExponent, prime1, prime2, exponent1, exponent2, coefficient} = options
	modulus = toInteger('modulus', modulus)
	publicExponent = toInteger('publicExponent', publicExponent)
	privateExponent = toInteger('privateExponent', privateExponent)
	prime1 = toInteger('prime1', prime1)
	prime2 = toInteger('prime2', prime2)
	exponent1 = toInteger('exponent1', exponent1)
	exponent2 = toInteger('exponent2', exponent2)
	coefficient = toInteger('coefficient', coefficient)
	const n =
		modulus.length +
		publicExponent.length +
		privateExponent.length +
		prime1.length +
		prime2.length +
		exponent1.length +
		exponent2.length +
		coefficient.length
	return [
		/* SEQUENCE */ 0x30,
		...length(3 + n),
		/* INTEGER */ 0x02, 0x01, 0x00, // version 0
		...modulus,
		...publicExponent,
		...privateExponent,
		...prime1,
		...prime2,
		...exponent1,
		...exponent2,
		...coefficient,
	]
}

rsaPrivateKey.pkcs1 = function(options) {
	const bytes = rsaPrivateKey(options)
	const lines = base64(bytes)
	const prefix = '-----BEGIN RSA PRIVATE KEY-----'
	const suffix = '-----END RSA PRIVATE KEY-----'
	return [prefix, ...lines, suffix].join('\n')
}

// RSAPublicKey ::= SEQUENCE {
// 	modulus INTEGER,
// 	publicExponent INTEGER,
// }
function rsaPublicKey(options) {
	let {modulus, publicExponent} = options
	modulus = toInteger('modulus', modulus)
	publicExponent = toInteger('publicExponent', publicExponent)
	const n = modulus.length + publicExponent.length
	return [/* SEQUENCE */ 0x30, ...length(n), ...modulus, ...publicExponent]
}

rsaPublicKey.pkcs1 = function(options) {
	const bytes = rsaPublicKey(options)
	const lines = base64(bytes)
	const prefix = '-----BEGIN RSA PUBLIC KEY-----'
	const suffix = '-----END RSA PUBLIC KEY-----'
	return [prefix, ...lines, suffix].join('\n')
}

// PublicKeyInfo ::= SEQUENCE {
// 	algorithm OBJECT IDENTIFIER,
// 	parameters NULL, -- for our purposes
// 	publicKey BIT STRING,
// }
rsaPublicKey.pkcs8 = function(options) {
	const bytes = rsaPublicKey(options)
	// XXX(bnoordhuis) It's unclear to me why openssl inserts an
	// end-of-content marker byte (0x00) between the bit string's
	// length and its payload but let's be compatible.
	const inner = [
		/* SEQUENCE */ 0x30, 0x0D,
		/* OBJECT IDENTIFIER */ 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x01, // 1.2.840.113549.1.1.1
		/* NULL */ 0x05, 0x00,
		/* BIT STRING */ 0x03, ...length(1 + bytes.length), 0x00, ...bytes]
	const outer = [/* SEQUENCE */ 0x30, ...length(inner.length), ...inner]
	const lines = base64(outer)
	const prefix = '-----BEGIN PUBLIC KEY-----'
	const suffix = '-----END PUBLIC KEY-----'
	return [prefix, ...lines, suffix].join('\n')
}

function toBytes(name, x) {
	if (typeof x === 'string')
		return fromHex(name, x)

	if (typeof x === 'bigint')
		return fromBigInt(name, x)

	if (x instanceof Uint8Array)
		return [...x]

	throw new Error('bad ' + name)
}

function fromHex(name, x) {
	const n = x.length

	if (n & 1)
		throw new Error(name + ' length is not a multiple of two')

	const bytes = []

	for (let i = 0; i < n; i += 2) {
		const hi = unhex(x.charCodeAt(i + 0))
		const lo = unhex(x.charCodeAt(i + 1))
		bytes.push(16 * hi + lo)
	}

	return bytes
}

function fromBigInt(name, x) {
	const mask = BigInt(255)
	const shift = BigInt(8)
	const zero = BigInt(0)

	if (x === zero)
		return [0] // should probably be an error

	if (x < zero)
		throw new Error(name + ' is less than zero')

	const bytes = []

	while (x !== zero) {
		bytes.unshift(Number(x & mask))
		x >>= shift
	}

	if (bytes[0] >= 0x80)
		bytes.unshift(0) // Disambiguate unsigned number.

	return bytes
}

function unhex(c) {
	if (c >= 48 && c <= 57)
		return c - 48

	if (c >= 65 && c <= 70)
		return c - 55

	if (c >= 97 && c <= 102)
		return c - 87

	throw new Error('Not hexadecimal: ' + String.fromCharCode(c))
}

function toInteger(name, x) {
	x = toBytes(name, x)
	return [/* INTEGER */ 0x02, ...length(x.length), ...x]
}

function length(n) {
	switch (true) {
	case n < 0x80:
		return [n]
	case n < 0x100:
		return [0x81, n]
	case n < 0x10000:
		return [0x82, n >>> 8, n & 255]
	case n < 0x1000000:
		return [0x83, n >>> 16, (n >>> 8) & 255, n & 255]
	}
	throw new Error('UNREACHABLE')
}

function base64(bytes) {
	const digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	const n = bytes.length

	const lines = []
	let line = []

	for (let i = 0; i+3 <= n; i += 3) {
		const a = bytes[i + 0]
		const b = bytes[i + 1]
		const c = bytes[i + 2]

		const w = digits[a >>> 2]
		const x = digits[16 * (a & 3) + (b >>> 4)]
		const y = digits[4 * (b & 15) + (c >>> 6)]
		const z = digits[c & 63]

		line.push(w, x, y, z)

		if (line.length === 64) { // mirrors `openssl base64 -e`
			lines.push(line.join(''))
			line = []
		}
	}

	switch (n % 3) {
	case 0:
		break
	case 1:
		{
			const a = bytes[n - 1]
			const w = digits[a >>> 2]
			const x = digits[16 * (a & 3)]
			line.push(w, x, '=', '=')
		}
		break
	case 2:
		{
			const a = bytes[n - 2]
			const b = bytes[n - 1]
			const w = digits[a >>> 2]
			const x = digits[16 * (a & 3) + (b >>> 4)]
			const y = digits[4 * (b & 15)]
			line.push(w, x, y, '=')
		}
		break
	}

	if (line.length > 0)
		lines.push(line.join(''))

	return lines
}
