import {
    type RequiredVault,
    makeParser as baseMakeParser,
} from "./parse/remark.js";
import type { FilePath } from "./file.js";

export function makeParser(opts: Partial<RequiredVault> = {}) {
    return baseMakeParser({
        index: () => [],
        externalize: (filePath) => filePath,
        resolvePath: (reference) => reference as FilePath,
        ...opts,
    });
}

const parse = makeParser();

export { parse };
