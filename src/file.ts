import type { Root } from "mdast";
import { VFile } from "vfile";

import type { DB } from "./db.js";
import type { Asset } from "./asset.js";
import type { ParseResult } from "./parse/remark.js";
import type { Frontmatter } from "./parse/frontmatter.js";

export class File {
    constructor(
        private db: DB,
        private vfile: VFile,
    ) {}

    private parseResult: ParseResult | undefined;

    private async ensureParsed(): Promise<ParseResult> {
        if (!this.parseResult) {
            this.parseResult = this.db.parse(this.vfile);
        }

        return this.parseResult;
    }

    async ast(): Promise<Root> {
        const { ast } = await this.ensureParsed();

        return ast;
    }

    async frontmatter(): Promise<Frontmatter> {
        const { frontmatter } = await this.ensureParsed();

        return frontmatter;
    }

    resolve(reference: string): File | Asset | undefined {
        return this.db.resolve(reference, this);
    }
}
