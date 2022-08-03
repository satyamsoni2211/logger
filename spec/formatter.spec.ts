import { BasicFormatter } from "../src/formatter";
import { LogRecord } from "../src/record"
import moment from 'moment';
import { describe, expect, it } from "vitest"

describe('test basic formatter', () => {
    it('check record', () => { /* ... */
        const f = new BasicFormatter();
        const r = new LogRecord("this is ${name}", 1, "DEBUG", moment().unix(), { name: "foobar" });
        const s = f.format(r)
        expect(s).toEqual(`[DEBUG] ${r.getIsoFormatTime()} this is foobar`);
        expect(s).toContain("DEBUG")
    })

})