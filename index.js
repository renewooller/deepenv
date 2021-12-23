const _set = require('lodash/set')

let prefix = "ENV2DEEPCONF_"

exports.prefix = prefix

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

exports.config  = function config(custom_prefix) {
    prefix = custom_prefix || prefix
    return Object.keys(process.env) // [<keys>]
    .filter(key=>key.startsWith(prefix)) // keys starting with prefix
    .map(key=> [key, parseEnvValue(process.env[key]) ] )  //   [ <key>, <parsed value> ]
    .reduce((obj, [key, value]) => { // [ [<key>, <value>] ] => {  deep config object }
        let path = key
            .toLowerCase()
            .slice(prefix.length) // <prefix>_a_b -> a_b
            .split("__") // A__B_C__D -> [A, B_C, D]   // this is a convention that '__' in an env var equates to '.' in an object
            .join('.') // [A, B_C, D] -> a.b_c.d 
        _set(obj, path, value)
        return obj;
    }, {})
}
