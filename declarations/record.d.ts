import { RecordInterfaceType } from "./base_types";
import { LevelTypes } from './enums';
export declare class LogRecord implements RecordInterfaceType {
    event: any;
    level: LevelTypes;
    levelNo: number;
    extra: object;
    context_key: string;
    args: Array<string>;
    time: number;
    constructor(event: any, levelNo: number, level: "ERROR" | "DEBUG" | "INFO" | "WARN" | "CRITICAL" | undefined, time: number, extra?: object, context_key?: string, args?: Array<any>);
    getMessage(): any;
    getTimeInMilliseconds(): number;
    getIsoFormatTime(): string;
    getFormattedTime(format?: string): string;
}
