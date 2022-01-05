const deepenv = require('deepenv').deepenv

describe('parse', () => {

    beforeEach(() => { // clear the config from previous tests
        Object.keys(process.env).filter(item => /^DEEPENV_/i.test(item)).forEach(item => delete process.env[item])
    })

    test('parse nulls', () => {
        process.env['DEEPENV_BLANK'] = ''
        process.env['DEEPENV_SPACES'] = '   '
        process.env['DEEPENV_NULLTEXT'] = 'null'
        process.env['DEEPENV_UNDEFINEDTEXT'] = 'undefined'
        const config  = deepenv()
        
        expect(config['blank']).toBeUndefined()
        expect(config['nulltext']).toEqual('null')
        expect(config['undefinedtext']).toEqual('undefined')
        expect(config['spaces']).toEqual('   ')
    })

    test('parse numbers', () => {
        process.env[`DEEPENV_NUMBER`] = '12'
        process.env[`DEEPENV_NUMBER_ZERO`] = '0'
        process.env[`DEEPENV_NUMBER_ONE`] = '1'
        process.env[`DEEPENV_NUMBER_NEGATIVE`] = '-1'
        process.env[`DEEPENV_NUMBER_NEGATIVE100`] = '-100'
        process.env[`DEEPENV_NUMBER_FLOAT`] = '0.25'
        process.env[`DEEPENV_NUMBER_FLOAT2`] = '100.0'
        process.env[`DEEPENV_NUMBER_FLOAT3`] = '100.'
        process.env[`DEEPENV_NUMBER_FLOAT4`] = '.1'
        process.env[`DEEPENV_MALFORMED_FLOAT`] = '100..'
        process.env[`DEEPENV_MALFORMED_FLOAT2`] = '..123'
        
        const config = deepenv()
        expect(config['number']).toEqual(12)
        expect(config['number_zero']).toEqual(0)
        expect(config['number_one']).toEqual(1)
        expect(config['number_negative']).toEqual(-1)
        expect(config['number_negative100']).toEqual(-100)
        expect(config['number_float']).toEqual(0.25)
        expect(config['number_float2']).toEqual(100.0)
        expect(config['number_float3']).toEqual(100.0)
        expect(config['number_float4']).toEqual(0.1)
        expect(config['malformed_float']).toEqual('100..')
        expect(config['malformed_float2']).toEqual('..123')
    })
    
    test('parse_boolean', () => {
        process.env[`DEEPENV_BOOLEANTRUE`] = 'true'
        process.env[`DEEPENV_BOOLEANFALSE`] = 'false'
        process.env[`DEEPENV_BOOLEANTRUE_UC`] = 'TRUE'
        process.env[`DEEPENV_BOOLEANFALSE_UC`] = 'FALSE'
        process.env[`DEEPENV_BOOLEANTRUE_NC`] = 'True'
        process.env[`DEEPENV_BOOLEANFALSE_NC`] = 'False'

        const config = deepenv()

        expect(config['booleantrue']).toEqual(true)
        expect(config['booleanfalse']).toEqual(false)

        expect(config['booleantrue_uc']).toEqual(true)
        expect(config['booleanfalse_uc']).toEqual(false)

        expect(config['booleantrue_nc']).toEqual(true)
        expect(config['booleanfalse_nc']).toEqual(false)
        
    })

    test('parse json', () => {
        const obj = { levelOne: { levelTwo : { levelThree : {}}}, num: 0, txt: 'txt', boolTrue: true, boolFalse: false}
        process.env[`DEEPENV_JSON`] = JSON.stringify(obj)
        process.env[`DEEPENV_MALFORMED_JSON`] = '{"levelOne":{"levelTwo":{"levelThree":{}}},"num":0,"txt":"txt","boolTrue":true,"boolFalse":false'
        const config = deepenv()

        expect(config['json']).toEqual(obj)
        expect(config['malformed_json']).toEqual('{"levelOne":{"levelTwo":{"levelThree":{}}},"num":0,"txt":"txt","boolTrue":true,"boolFalse":false')
    })

    test('multilevel config', () => {
        process.env[`DEEPENV_LEVELONE__LEVELTWO__LEVELTHREE`] = "myvalue"

        const config = deepenv()
        
        expect(config).toEqual(
            {
                levelone: {
                    leveltwo: {
                        levelthree: 'myvalue'
                    }
                }
            })
    })

    test('merge existing config', () => {
        process.env[`DEEPENV_OUTER__INNER__NUMBER`] = '12'
        process.env[`DEEPENV_TO_OVERRIDE`] = '4'

        let original_config = {
            other_outer : 2,
            to_override : 1
        }

        const config = deepenv(original_config, {})

        expect(config).toEqual(
            {
                other_outer : 2,
                outer : {
                    inner : {
                        number : 12
                    }
                },
                to_override : 4
            }
        )

        // check that it is a new object not a reference
        expect(config).not.toBe(original_config)

        // check the original config hasn't been modified
        expect(original_config).toEqual({
            other_outer : 2,
            to_override : 1
        })

    })

})
