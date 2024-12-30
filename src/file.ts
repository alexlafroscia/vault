import type { Root } from "mdast";
import { VFile } from "vfile";
import { LazyGetter } from "lazy-get-decorator";

import type { DB } from "./db.js";
import type { Asset } from "./asset.js";
import type { ParseResult } from "./parse/remark.js";
import type { Frontmatter } from "./parse/frontmatter.js";

export class File {
    constructor(
        private db: DB,
        private vfile: VFile,
    ) {}

    @LazyGetter()
    private get parseResult(): ParseResult {
        return this.db.parse(this.vfile);
    }

    get ast(): Root {
        return this.parseResult.ast;
    }

    get frontmatter(): Frontmatter {
        return this.parseResult.frontmatter;
    }

    resolve(reference: string): File | Asset | undefined {
        return this.db.resolve(reference, this);
    }
}
