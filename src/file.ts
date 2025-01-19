import type { VFile } from "vfile";

import type { Asset } from "./asset.js";
import type { Brand } from "./brand.js";
import { memoized } from "./decorators/memoized.js";
import type { Root } from "./mdast.js";
import type { ParseResult } from "./parse/remark.js";
import type { Frontmatter } from "./parse/frontmatter.js";
import type { Vault } from "./vault.js";

export type FilePath = Brand<string, "FilePath">;

export class File {
    constructor(
        private vault: Vault,
        private vfile: VFile,
    ) {}

    @memoized
    private get parseResult(): ParseResult {
        return this.vault.parse(this.vfile);
    }

    get ast(): Root {
        return this.parseResult.ast;
    }

    get frontmatter(): Frontmatter {
        return this.parseResult.frontmatter;
    }

    resolve(reference: string): File | Asset | undefined {
        return this.vault.resolve(reference, this);
    }
}
