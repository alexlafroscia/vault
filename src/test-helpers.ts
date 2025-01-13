import { makeParser } from "./parse/remark.js";
import type { FilePath } from "./file.js";

const parse = makeParser({
    index: () => [],
    externalize: (filePath) => filePath,
    resolvePath: (reference) => reference as FilePath,
});

export { parse };
