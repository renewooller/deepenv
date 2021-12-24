const _set = require('lodash.set')

let prefix = "DEEPENV_"
let nesting_delimiter = "__"

exports.prefix = prefix
exports.nesting_delimiter = nesting_delimiter

function parseEnvValue(value) {
    // don't convert blanks into numbers, use  them
    if(value === '') return undefined
    if(value === 'null' ||  // needed so as not parsed into json later
       value === 'undefined' ||
       /^\s.*$/.test(value)) return value
        
    // dont accidentally convert 0 or 1 into boolean, prefer numbers
    if(!isNaN(+value)) return +value; // ref https://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
    
    // if it matches true or false use the boolean
    if(/^true$/i.test(value)) return true;            
    if(/^false$/i.test(value)) return false;

    // parse json string values into json objects
    try {
        return JSON.parse(value)
    } catch(err) {} // we don't need to handle this - if it fails, it's just a string
    
    //otherwise preserve the string
    return value;
}

/**
 * returns a copy 
 * @param {*} original (optional) configuration object to be merged with environment
 * @param {} opts (optional) options to specify the
 *   prefix:  for environment variable names that are to be included in configurations, default "DEEPENV_"
 *   nesting_delimiter: the delimiter in the environment variable name used to signify a nesting level in the config object, default "__" 
 * @returns 
 */
exports.deepenv  = function deepenv(
    original,
    opts, 
    ) {
    prefix = opts?.custom_prefix || prefix
    nesting_delimiter = opts?.custom_nesting_delimiter || nesting_delimiter
    return Object.keys(process.env) // [<keys>]
    .filter(key=>key.startsWith(prefix)) // keys starting with prefix
    .map(key=> [key, parseEnvValue(process.env[key]) ] )  //   [ <key>, <parsed value> ]
    .reduce((obj, [key, value]) => { // [ [<key>, <value>] ] => {  deep config object }
        let path = key
            .toLowerCase()
            .slice(prefix.length) // <prefix>_a_b -> a_b
            .split(nesting_delimiter) // A__B_C__D -> [A, B_C, D]   // this is a convention that '__' in an env var equates to '.' in an object
            .join('.') // [A, B_C, D] -> a.b_c.d 
        _set(obj, path, value) // overwrite the value from the original config, or, if it doesn't exist, creat it
        return obj;
    }, Object.assign({}, original)) // one day, this could be structuredClone(original)
}
