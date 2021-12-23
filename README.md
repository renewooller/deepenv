# deepenv
Generates a deeply nested configuration object suitable for backend apps, using environment variables.

[![NPM version](https://img.shields.io/npm/v/deepenv.svg?style=flat-square)](https://www.npmjs.com/package/deepenv)

[Best practice](https://12factor.net/config) demands that configuration should be contained in the environment rather than in code. This helps with security, managing environments, portability and open-source development.

Unfortunately environment variables are **flat** string key-value pairs, whereas most apps organise their configuration in **deeply nested** objects.

This means an environment variable such as
```
MYAPP_MYDATASTORE_CONNECTION_RETRY_INTERVAL=5s
```

needs to be manually wired into the configuration object, EG:
```
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

With a double-underscored environment variable:
```bash
MYAPP_MYDATASTORE__CONNECTION__RETRY_INTERVAL=5s
```

And **deepenv**:
```
const config = require('deepenv').config(
{   // static configuration
    mydatastore : {
        encoding : 'utf8'
    },
    myotherconfig : {}
}, 
{   // options
    custom_prefix 'MYAPP_'
})
```

deeply nested config is generated according to the environment:

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


## getting started

### install 

```npm i deepenv```



## options

customise the prefix

## external dependencies

the only external dependency is lodash.set method, not the whole lodash library.

## pre existing similar projects

### env2object
allows for deep nesting to be defined in .env files, but does not allow for deep nesting based of generic environment variables given in other ways (because dots aren't allowed in environment variable names):
https://github.com/doanthuanthanh88/env2object

### node-env2object
does allow for environment variable names to specify a nested object, however does not include adequate testing and customisation features:
https://github.com/tombburnell/node-env2object

### dotenv
popular project that reads from files into the environment, but doesn't help with the next step of going from environment variables into code config, for which manual wiring is still required. 
https://github.com/motdotla/dotenv
