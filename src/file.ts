import { VFile, type Compatible } from "vfile";

import type { DB } from "./db.js";
import type { Asset } from "./asset.js";

export class File {
    constructor(
        private db: DB,
        private vfile: VFile,
    ) {}

    resolve(reference: string): File | Asset | undefined {
        return undefined;
    }
}
