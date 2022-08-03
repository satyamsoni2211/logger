import moment from 'moment';
import { RecordInterfaceType } from "./base_types";
import { LevelTypes, LevelTags } from './enums';

export class LogRecord implements RecordInterfaceType {
    event: any;
    level: LevelTypes;
    levelNo: number;
    extra: object;
    context_key: string;
    args: Array<string> = [];
    time: number;
    constructor(event: any, levelNo: number, level: LevelTypes = LevelTags.debug, time: number,
        extra: object = {}, context_key: string = "", args: Array<any> = []) {
        this.event = event;
        this.level = level;
        this.time = time;
        this.extra = extra;
        this.context_key = context_key;
        this.args = args;
        this.levelNo = levelNo;
        this.getMessage = this.getMessage.bind(this);
        this.getTimeInMilliseconds = this.getTimeInMilliseconds.bind(this);
        this.getIsoFormatTime = this.getIsoFormatTime.bind(this);
        this.getFormattedTime = this.getFormattedTime.bind(this);
    }
    getMessage(): any {
        return this.event;
    }
    getTimeInMilliseconds(): number {
        return this.time;
    }
    getIsoFormatTime(): string {
        return moment.unix(this.time).toISOString();
    }
    getFormattedTime(format: string = "YYYY-MM-DD HH:mm:ss ZZ"): string {
        return moment.unix(this.time).format(format);
    }

}
