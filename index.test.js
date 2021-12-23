
describe('parse', () => {

    beforeEach(() => { // clear the config from previous tests
        Object.keys(process.env).filter(item => /^ENV2DEEPCONF_/i.test(item)).forEach(item => delete process.env[item])
    })

    test('parse nulls', () => {
        process.env['ENV2DEEPCONF_BLANK'] = ''
        process.env['ENV2DEEPCONF_SPACES'] = '   '
        process.env['ENV2DEEPCONF_NULLTEXT'] = 'null'
        process.env['ENV2DEEPCONF_UNDEFINEDTEXT'] = 'undefined'
        const config  = require('./index.js').config()
        
        expect(config['blank']).toBeUndefined()
        expect(config['nulltext']).toEqual('null')
        expect(config['undefinedtext']).toEqual('undefined')
        expect(config['spaces']).toEqual('   ')
    })

    test('parse numbers', () => {
        process.env[`ENV2DEEPCONF_NUMBER`] = '12'
        process.env[`ENV2DEEPCONF_NUMBER_ZERO`] = '0'
        process.env[`ENV2DEEPCONF_NUMBER_ONE`] = '1'
        process.env[`ENV2DEEPCONF_NUMBER_NEGATIVE`] = '-1'
        process.env[`ENV2DEEPCONF_NUMBER_NEGATIVE100`] = '-100'
        
        
        const config = require('./index.js').config()
        expect(config['number']).toEqual(12)
        expect(config['number_zero']).toEqual(0)
        expect(config['number_one']).toEqual(1)
        expect(config['number_negative']).toEqual(-1)
        expect(config['number_negative100']).toEqual(-100)
    })
    
    test('parse_boolean', () => {
        process.env[`ENV2DEEPCONF_BOOLEANTRUE`] = 'true'
        process.env[`ENV2DEEPCONF_BOOLEANFALSE`] = 'false'
        process.env[`ENV2DEEPCONF_BOOLEANTRUE_UC`] = 'TRUE'
        process.env[`ENV2DEEPCONF_BOOLEANFALSE_UC`] = 'FALSE'
        process.env[`ENV2DEEPCONF_BOOLEANTRUE_NC`] = 'True'
        process.env[`ENV2DEEPCONF_BOOLEANFALSE_NC`] = 'False'

        const config = require('./index.js').config()

        expect(config['booleantrue']).toEqual(true)
        expect(config['booleanfalse']).toEqual(false)

        expect(config['booleantrue_uc']).toEqual(true)
        expect(config['booleanfalse_uc']).toEqual(false)

        expect(config['booleantrue_nc']).toEqual(true)
        expect(config['booleanfalse_nc']).toEqual(false)
        
    })

    test('parse json', () => {
        const obj = { levelOne: { levelTwo : { levelThree : {}}}, num: 0, txt: 'txt', boolTrue: true, boolFalse: false}
        process.env[`ENV2DEEPCONF_JSON`] = JSON.stringify(obj)
        process.env[`ENV2DEEPCONF_MALFORMED_JSON`] = '{"levelOne":{"levelTwo":{"levelThree":{}}},"num":0,"txt":"txt","boolTrue":true,"boolFalse":false'
        const config = require('./index.js').config()

        expect(config['json']).toEqual(obj)
        expect(config['malformed_json']).toEqual('{"levelOne":{"levelTwo":{"levelThree":{}}},"num":0,"txt":"txt","boolTrue":true,"boolFalse":false')
    })

    test('multilevel config', () => {
        process.env[`ENV2DEEPCONF_LEVELONE__LEVELTWO__LEVELTHREE`] = "myvalue"

        const config = require('./index.js').config()
        
        expect(config).toEqual(
            {
                levelone: {
                    leveltwo: {
                        levelthree: 'myvalue'
                    }
                }
            })
    })

})
