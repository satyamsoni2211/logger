"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelTags = exports.Levels = void 0;
var Levels;
(function (Levels) {
    Levels[Levels["not_set"] = 0] = "not_set";
    Levels[Levels["debug"] = 1] = "debug";
    Levels[Levels["info"] = 2] = "info";
    Levels[Levels["warn"] = 3] = "warn";
    Levels[Levels["error"] = 4] = "error";
    Levels[Levels["critical"] = 5] = "critical";
})(Levels || (Levels = {}));
exports.Levels = Levels;
var LevelTags;
(function (LevelTags) {
    LevelTags["not_set"] = "NOT_SET";
    LevelTags["debug"] = "DEBUG";
    LevelTags["info"] = "INFO";
    LevelTags["warn"] = "WARN";
    LevelTags["error"] = "ERROR";
    LevelTags["critical"] = "CRITICAL";
})(LevelTags || (LevelTags = {}));
exports.LevelTags = LevelTags;
//# sourceMappingURL=enums.js.map