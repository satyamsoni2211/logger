import { BasicFormatter } from '../src/formatter';
import { ConsoleHandler } from '../src/handler';
import { Logger } from '../src/logger';
import { describe, it, expect, vi } from 'vitest'

describe(
    "Test logging", () => {
        it("check base logger ", () => {
            const mock = vi.fn((v: string) => v);
            console.info = mock;
            const logger = new Logger();
            const handler = new ConsoleHandler();
            const formatter = new BasicFormatter();
            handler.setFormatter(formatter);
            logger.addHandler(handler);
            logger.info("this is cool")
            expect(mock).toHaveBeenCalled()
            expect(mock).toHaveBeenCalledOnce()
        })
    }
)