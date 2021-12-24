# deepenv
Generates a deeply nested configuration object suitable for backend apps, using environment variables.

[![NPM version](https://img.shields.io/npm/v/deepenv.svg?style=flat-square)](https://www.npmjs.com/package/deepenv) [![CircleCI](https://circleci.com/gh/renewooller/deepenv/tree/main.svg?style=svg)](https://circleci.com/gh/renewooller/deepenv/tree/main)

[Best practice](https://12factor.net/config) demands that configuration that changes across environments should be contained in the environment rather than in code. This helps with security, managing environments, portability and open-source development.

Unfortunately environment variables are **flat** string key-value pairs, whereas most apps organise their configuration in **deeply nested** objects. Environment variable names cannot include a period to indicate nesting. 

This means backend developers have to take environment variables such as
```bash
MYAPP_MYDATASTORE_CONNECTION_RETRY_INTERVAL=5s
```

are manually wire them into the configuration object, EG:
```node
const config = 
{
    mydatastore : {
        encoding : 'utf8'
        connection : {
            retry_interval : process.env['MYAPP_MYDATASTORE_CONNECTION_RETRY_INTERVAL']
        }
    },
    myotherconfig : {}
}
```

**deepenv.js** automates this process, saving time and enforcing consistency between environment variable names and configuration.

## quick start (2 mins)

Install **deepenv** to a project directory that has been initialised with npm (```npm init```):
```bash 
npm i deepenv
```

Create your application, generating the config using **deepenv** :
```node 
// file: myapp.js
const config = require('deepenv').config()
console.log(config)
```

Run your application using a double-underscored environment variable:
```bash
DEEPENV_A__B__C=4 node myapp.js
```

Observe the generated config

```node
{ a: { b: { c: 4 } } }
```



## deeper demo

Many configuration parameters need not be specified by the environment. These are the first argument to **deepenv**, so they can be merged with those that _are_ specified by the environment.

Options, such as a custom prefix for environment variables that are used by **deepenv**, are supplied in the second argument.

With a double-underscored environment variable:
```bash
MYAPP_MYDATASTORE__CONNECTION__RETRY_INTERVAL=5s
```

And **deepenv**:
```node
const config = require('deepenv').config(
{   // pre-existing configuration, not mutated by deepenv
    mydatastore : {
        encoding : 'utf8'
    },
    myotherconfig : {}
}, 
{   // deepenv options
    custom_prefix 'MYAPP_'
})
```

deeply nested config is generated from the environment:

```node
{
    mydatastore : {
        encoding : 'utf8'
        connection : {
            retry_interval : '5s'
        }
    },
    myotherconfig : {}
}
```

## options

**custom_prefix** : override the default prefix 'DEEPENV_' with one based on the name of your app.

**custom_nesting_delimiter** : override the default nesting delimiter '__' with something else. Note that environment variable names [must consist solely of uppercase letters, digits, and the '_'](https://pubs.opengroup.org/onlinepubs/000095399/basedefs/xbd_chap08.html). 

## external dependencies

the only external dependency is lodash.set method, not the whole lodash library.

## review of similar projects

### env2object
allows for deep nesting to be defined in .env files, but does not allow for deep nesting based of generic environment variables given in other way, because dots aren't allowed in environment variable names:
https://github.com/doanthuanthanh88/env2object

### node-env2object
does allow for environment variable names to specify a nested object, however does not include adequate testing and customisation features:
https://github.com/tombburnell/node-env2object

### dotenv
popular project that reads from files into the environment, but doesn't help with the next step of going from environment variables into code config, for which manual wiring is still required. 
https://github.com/motdotla/dotenv
