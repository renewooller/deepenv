# deepenv
Generates a deeply nested configuration object suitable for backend apps, using environment variables.

[Best practice](https://12factor.net/config) demands that configuration should be contained in the environment rather than in code. This helps with security, managing environments, portability and open-source development.

Unfortunately environment variables are **flat** string key-value pairs, whereas most apps organise their configuration into **deeply nested** objects.

This means an environment variable such as
```
MYAPP_MYDATASTORE_CONNECTION_RETRY_INTERVAL=5s
```

needs to be manually wired into the configuration object:
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

With environment variable:
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

config is generated according to the environment:

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
