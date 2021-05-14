import debug from "debug";

/**
 * Logging class. Code derived from example by Ashwin M (@glocore).
 */
export class Log {
    static colors: { [index: string]: string } = {
        info: "lightblue",
        warning: "orange",
        error: "red",
    };

    private static message(level: string, message: string, source?: string) {
        const namespace = `VRM: ${level}`;
        const logger = debug(namespace);
        logger.color = Log.colors[level];
        if (source) {
            logger(source, message);
        } else {
            logger(message);
        }
    }

    static info(message: string, source?: string) {
        return Log.message("info", message, source);
    }

    static warn(message: string, source?: string) {
        return Log.message("warning", message, source);
    }

    static error(message: string, source?: string) {
        return Log.message("error", message, source);
    }
}
