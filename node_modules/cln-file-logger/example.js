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