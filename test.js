'use strict'

const assert = require('assert')
const {rsaPrivateKey, rsaPublicKey} = require('./')

assert.throws(
	() => rsaPublicKey({modulus: 1, publicExponent: 1n}),
	/bad modulus/)

assert.throws(
	() => rsaPublicKey({modulus: 1n, publicExponent: 1}),
	/bad publicExponent/)

assert.throws(
	() => rsaPublicKey({modulus: '0', publicExponent: 1n}),
	/modulus length is not a multiple of two/)

assert.throws(
	() => rsaPublicKey({modulus: 1n, publicExponent: '0'}),
	/publicExponent length is not a multiple of two/)

assert.throws(
	() => rsaPublicKey({modulus: -1n, publicExponent: 1n}),
	/modulus is less than zero/)

assert.throws(
	() => rsaPublicKey({modulus: 1n, publicExponent: -1n}),
	/publicExponent is less than zero/)

{
	const modulus = 0xAC32045DC7111E797B1C3EFA85CE9FFAFC821DA1E2929419FBDFAD45599C0C4141B4A826EB5D8B5D5CFCAAA7607819386F888AA26896484C24D8F3B0A257B6C5BC7DA59943092EC09CDC1690E171506C45390F98CD15F3FB83BF0C10A6C26FDAC47D8308D841B06DF29151952B61E05A77320C1C43041C3CA2057AC2A214D731n
	const publicExponent = 0x23n
	const actual = rsaPublicKey.pkcs1({modulus, publicExponent})
	const expected =
		'-----BEGIN RSA PUBLIC KEY-----\n' +
		'MIGHAoGBAKwyBF3HER55exw++oXOn/r8gh2h4pKUGfvfrUVZnAxBQbSoJutdi11c\n' +
		'/KqnYHgZOG+IiqJolkhMJNjzsKJXtsW8faWZQwkuwJzcFpDhcVBsRTkPmM0V8/uD\n' +
		'vwwQpsJv2sR9gwjYQbBt8pFRlSth4Fp3MgwcQwQcPKIFesKiFNcxAgEj\n' +
		'-----END RSA PUBLIC KEY-----'
	assert.strictEqual(actual, expected)
}

{
	// Note the leading 00 vis-a-vis the bigint version; it distinguishes
	// it as an unsigned integer.
	const modulus = '00AC32045DC7111E797B1C3EFA85CE9FFAFC821DA1E2929419FBDFAD45599C0C4141B4A826EB5D8B5D5CFCAAA7607819386F888AA26896484C24D8F3B0A257B6C5BC7DA59943092EC09CDC1690E171506C45390F98CD15F3FB83BF0C10A6C26FDAC47D8308D841B06DF29151952B61E05A77320C1C43041C3CA2057AC2A214D731'
	const publicExponent = '23'
	const actual = rsaPublicKey.pkcs1({modulus, publicExponent})
	const expected =
		'-----BEGIN RSA PUBLIC KEY-----\n' +
		'MIGHAoGBAKwyBF3HER55exw++oXOn/r8gh2h4pKUGfvfrUVZnAxBQbSoJutdi11c\n' +
		'/KqnYHgZOG+IiqJolkhMJNjzsKJXtsW8faWZQwkuwJzcFpDhcVBsRTkPmM0V8/uD\n' +
		'vwwQpsJv2sR9gwjYQbBt8pFRlSth4Fp3MgwcQwQcPKIFesKiFNcxAgEj\n' +
		'-----END RSA PUBLIC KEY-----'
	assert.strictEqual(actual, expected)
}

{
	// Note how the modulus doesn't have a leading zero and as a result
	// is interpreted as a signed integer.
	const modulus = 'AC32045DC7111E797B1C3EFA85CE9FFAFC821DA1E2929419FBDFAD45599C0C4141B4A826EB5D8B5D5CFCAAA7607819386F888AA26896484C24D8F3B0A257B6C5BC7DA59943092EC09CDC1690E171506C45390F98CD15F3FB83BF0C10A6C26FDAC47D8308D841B06DF29151952B61E05A77320C1C43041C3CA2057AC2A214D731'
	const publicExponent = '23'
	const actual = rsaPublicKey.pkcs1({modulus, publicExponent})
	const expected =
		'-----BEGIN RSA PUBLIC KEY-----\n' +
		'MIGHAoGBAKwyBF3HER55exw++oXOn/r8gh2h4pKUGfvfrUVZnAxBQbSoJutdi11c\n' +
		'/KqnYHgZOG+IiqJolkhMJNjzsKJXtsW8faWZQwkuwJzcFpDhcVBsRTkPmM0V8/uD\n' +
		'vwwQpsJv2sR9gwjYQbBt8pFRlSth4Fp3MgwcQwQcPKIFesKiFNcxAgEj\n' +
		'-----END RSA PUBLIC KEY-----'
	assert.notStrictEqual(actual, expected)
}

{
	const modulus = 0xD13069344E9FAC1A853815B4C5EFA97B837B8E752A6A2C19CFE140CA49D86FDE9FA57EBE85A62261F0A9D720F28CAB96F8117F97E06873ECF283304B36E22862AB050C97CF5EC6F16D5B66D7C2AAB45E932A745E910B16DB058CB70C53D3093BE81DAA007E6C07CF005F7A51EDD8F69897864DC61A43E1470FDFF96B501E4A87n
	const publicExponent = 0x10001n
	const actual = rsaPublicKey.pkcs8({modulus, publicExponent})
	const expected =
		'-----BEGIN PUBLIC KEY-----\n' +
		'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRMGk0Tp+sGoU4FbTF76l7g3uO\n' +
		'dSpqLBnP4UDKSdhv3p+lfr6FpiJh8KnXIPKMq5b4EX+X4Ghz7PKDMEs24ihiqwUM\n' +
		'l89exvFtW2bXwqq0XpMqdF6RCxbbBYy3DFPTCTvoHaoAfmwHzwBfelHt2PaYl4ZN\n' +
		'xhpD4UcP3/lrUB5KhwIDAQAB\n' +
		'-----END PUBLIC KEY-----'
	assert.strictEqual(actual, expected)
}

{
	const modulus = 0xF1DF0773A6ADABBF09B751CBA7D6A003FC2941FB05BE4614759D58B1DBCE90BDA36A78F01D080C302CBF3636A5DC55045B438B3DE6CA65427C2F8E090574A5571538CF28A248E5A577C1244DEB510154F758A42ADEE77E727C6FEE0F2B191429D541D9C2675B675C047C062AF108D8C7A9B5722320468EC36834210F6F6477E5n
	const publicExponent = 0x10001n
	const privateExponent = 0x935E9BD0B87EDAC5346B50D8307451DCFBB83BAE71EA6412B532E0C6C5B1CF78EC67C43630CA257AF8D8AC74918C74F48992D6F52978AA47DF18AE870A9EEED9B816C0818384D8A9095ED78A31C66ED335E070C060B7381EE18A891B6808DB3D9D6102E36CEA6B3761BBEF8FA2E6C73C78DA6F0EE435C21B6FDFF8A32F68D521n
	const prime1 = 0xFDE92B3AC5A43685BDDA7DE6FA6B1D56EC5E7A4E01F3B1284CEB730976F57726C865456FE09E3C54088CE37861647599724D9BA03FE18708C2339356778A18E9n
	const prime2 = 0xF3DC80154D74D65267C851E28808E27CF05AB42197D3116EAAAD7CE9F64CAFED8CCBF5D002E094F9A7DD268F48D44F283DA1A0B6C5B87144465712EFDA5B099Dn
	const exponent1 = 0xA15F73EE2276BF8038AD889F2840B3A0EF110CC24F534620CAE2497696786385EE8F0E9690378138174713BB0A8B0282C7B6B35621C38042FCCA32B61DBB5321n
	const exponent2 = 0x6612DDEA0CC9E30C0B34E65193EF641E37DD3F98F01C0127F97934D819A86FDB571BE8807133E027C003E9A8002C1E1611F61D7763BB986DA3A3BEE176DCB461n
	const coefficient = 0x6823D79A48C9FE97CD565CE5541E7CE1DD9C01E06B93CB13175CD3A1BA215DD33E0B280321F7D678C509AA4A81245EC7CCE0A3E97E162317F6F021C3F980E7A2n
	const options = {modulus, publicExponent, privateExponent, prime1, prime2, exponent1, exponent2, coefficient}
	const actual = rsaPrivateKey.pkcs1(options)
	const expected =
		'-----BEGIN RSA PRIVATE KEY-----\n' +
		'MIICXQIBAAKBgQDx3wdzpq2rvwm3Ucun1qAD/ClB+wW+RhR1nVix286QvaNqePAd\n' +
		'CAwwLL82NqXcVQRbQ4s95splQnwvjgkFdKVXFTjPKKJI5aV3wSRN61EBVPdYpCre\n' +
		'535yfG/uDysZFCnVQdnCZ1tnXAR8BirxCNjHqbVyIyBGjsNoNCEPb2R35QIDAQAB\n' +
		'AoGBAJNem9C4ftrFNGtQ2DB0Udz7uDuucepkErUy4MbFsc947GfENjDKJXr42Kx0\n' +
		'kYx09ImS1vUpeKpH3xiuhwqe7tm4FsCBg4TYqQle14oxxm7TNeBwwGC3OB7hiokb\n' +
		'aAjbPZ1hAuNs6ms3Ybvvj6Lmxzx42m8O5DXCG2/f+KMvaNUhAkEA/ekrOsWkNoW9\n' +
		'2n3m+msdVuxeek4B87EoTOtzCXb1dybIZUVv4J48VAiM43hhZHWZck2boD/hhwjC\n' +
		'M5NWd4oY6QJBAPPcgBVNdNZSZ8hR4ogI4nzwWrQhl9MRbqqtfOn2TK/tjMv10ALg\n' +
		'lPmn3SaPSNRPKD2hoLbFuHFERlcS79pbCZ0CQQChX3PuIna/gDitiJ8oQLOg7xEM\n' +
		'wk9TRiDK4kl2lnhjhe6PDpaQN4E4F0cTuwqLAoLHtrNWIcOAQvzKMrYdu1MhAkBm\n' +
		'Et3qDMnjDAs05lGT72QeN90/mPAcASf5eTTYGahv21cb6IBxM+AnwAPpqAAsHhYR\n' +
		'9h13Y7uYbaOjvuF23LRhAkBoI9eaSMn+l81WXOVUHnzh3ZwB4GuTyxMXXNOhuiFd\n' +
		'0z4LKAMh99Z4xQmqSoEkXsfM4KPpfhYjF/bwIcP5gOei\n' +
		'-----END RSA PRIVATE KEY-----'
	assert.strictEqual(actual, expected)
}