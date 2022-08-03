import { LevelTypes } from "./enums";
interface FormatterInterface {
    format(value: RecordInterface): string;
}
interface HandlerInterface {
    formatter: FormatterInterface;
    level: number;
    setFormatter(formatter: FormatterInterface): void;
    emit(record: RecordInterface): void;
    setLevel(level: number): void;
    filter(level: number): boolean;
}
interface LoggerInterface {
    addHandler(handler: HandlerInterface): void;
    setLevel(level: number): void;
    handle(record: RecordInterface): void;
    debug(message: string, props?: Map<string, any>): void;
    info(message: string, props?: Map<string, any>): void;
    warn(message: string, props?: Map<string, any>): void;
    error(message: string, props?: Map<string, any>): void;
    critical(message: string, props?: Map<string, any>): void;
}
interface RecordInterface {
    event: any;
    level: LevelTypes;
    levelNo: number;
    extra: any;
    context_key: string;
    time: number;
    getMessage(): any;
    args: Array<string>;
    getTimeInMilliseconds(): number;
    getIsoFormatTime(): string;
    getFormattedTime(format?: string): string;
}
export declare type JSONRecord = {
    module?: string;
    exc_text?: string;
    stack_info?: string | undefined;
    lineno?: number;
    funcName?: string;
    thread?: string;
    threadName?: string;
    processName?: string;
    process?: number;
    context?: {
        [key: string]: any;
    };
    message: string;
    timestamp: string;
    level: string;
    user?: string;
};
export declare type FormatterInterfaceType = FormatterInterface;
export declare type HandlerInterfaceType = HandlerInterface;
export declare type LoggerInterfaceType = LoggerInterface;
export declare type RecordInterfaceType = RecordInterface;
export {};
