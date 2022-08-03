# FrontEnd Logging Abstraction

This is a utility package for implementing logging abstraction and is highly customizable. It contains 3 entities mainly `Logger`, `Formatter` and `Handler`.

### Logger

This is the main entity that is responsible for all the logging. It uses `Handler` to log all the details.

`Logger` can be considered as a skeleton to proxy to log records to underlying entities.

### Handler

`Handlers` are responsible for forwarding the log records to the expected destinations.

`handlers` can be anything from a *Basic Console Handler* to a handler forwarding log records to third party applications like `Sumologic`,`ElasticCache`,`Database`, `FileSystem` etc.

New handlers can be easily created by extending `BaseHandler` abstract class and overriding hooks.


### Formatter

`Formatter` is an entity that is responsible for formatting the log records. 

`Formatter` can format log records to simple text or JSON or anything you want.

These are again higly customizable.

### Creating simple logger

Creating basic logger is very easy. We create formatter and handler instances and register them to logger instances.

```javascript
import { Logger, formatters, handlers, Levels, utils } from "gs_logger"

const f = new formatters.BasicFormatter();
const h = new handlers.ConsoleHandler();
h.setFormatter(f);
const l = new Logger();
l.addHandler(h);
l.info("wow this works")
```

Above will log below record to console.

```bash
[INFO] wow this works
```

Basic logger can also be created using utils `get_basic_logger` method.

```javascript
import { utils } from "gs_logger"

const l = utils.get_basic_logger();
l.info("wow this works")
```

This would create a basic console logger instance.

### Creating Custom Logger

You can also customize logger instance creation using utility method `get_custom_logger`.

```javascript
import { Logger, formatters, handlers, Levels, utils } from "gs_logger"

const f = new formatters.JSONFormatter();
const l = utils.get_custom_logger({
    formatter: f,
    handlers: [new handlers.ConsoleHandler()]
})
l.info("${name} this works", { name: "sam" })

try {
    throw new Error("Couldn't create logger")
} catch (error) {
    l.error(error)
}
```

This will create a custom logger instance with provided formatters and handlers. This also has option for passing level to set the log level.