declare enum Levels {
    not_set = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    critical = 5
}
declare enum LevelTags {
    not_set = "NOT_SET",
    debug = "DEBUG",
    info = "INFO",
    warn = "WARN",
    error = "ERROR",
    critical = "CRITICAL"
}
declare type LevelTypes = Uppercase<Exclude<keyof typeof Levels, "not_set">>;
export { Levels, LevelTags, LevelTypes };
