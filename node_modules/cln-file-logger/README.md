# cln-file-logger

A simple file logger for use in a Core Lightning plugin

# Example

```js
import FileLogger from "./index.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = new FileLogger('[Example]', path.join(__dirname, 'example.log'));

logger.logInfo('This is an info message');
logger.logDebug('This is a debug message');
logger.logWarn('This is a warning message');
logger.logError('This is an error message');

const someObject = {
	foo: 'bar',
	baz: 'qux'
};

logger.logInfo(someObject);
logger.logDebug(someObject);
logger.logWarn(someObject);
logger.logError(someObject);

const subLogger = logger.child('[Sub-example]');

subLogger.logInfo('This is an info message');
subLogger.logDebug('This is a debug message');
subLogger.logWarn('This is a warning message');
subLogger.logError('This is an error message');

subLogger.logInfo(someObject);
subLogger.logDebug(someObject);
subLogger.logWarn(someObject);
subLogger.logError(someObject);
```

# Output

```
[Example] [INFO] This is an info message
[Example] [DEBUG] This is a debug message
[Example] [WARN] This is a warning message
[Example] [ERROR] This is an error message
[Example] [INFO] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [DEBUG] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [WARN] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [ERROR] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [Sub-example] [INFO] This is an info message
[Example] [Sub-example] [DEBUG] This is a debug message
[Example] [Sub-example] [WARN] This is a warning message
[Example] [Sub-example] [ERROR] This is an error message
[Example] [Sub-example] [INFO] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [Sub-example] [DEBUG] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [Sub-example] [WARN] {
  "foo": "bar",
  "baz": "qux"
}
[Example] [Sub-example] [ERROR] {
  "foo": "bar",
  "baz": "qux"
}
```