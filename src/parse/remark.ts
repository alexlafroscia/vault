import type { Compatible } from "vfile";
import { unified, type Processor as BaseProcessor } from "unified";
import remarkParse from "remark-parse";

import { remarkCallout, makeOptions as makeCalloutOptions } from "./callout.js";
import { type Frontmatter, remarkFrontmatter, matter } from "./frontmatter.js";
import type { Root } from "../mdast.js";
import { remarkImageTransclusion } from "./transclusion.js";
import type { Vault } from "../vault.js";
import {
    remarkWikiLink,
    makeOptions as makeRemarkWikiLinkOptions,
} from "./wiki-link.js";

export interface ParseResult {
    ast: Root;
    frontmatter: Frontmatter;
}

export type Processor = BaseProcessor<Root, Root, Root, undefined, undefined>;

export type RequiredVault = Pick<
    Vault,
    "index" | "externalize" | "resolvePath"
> & {
    options?: Pick<Vault["options"], "setupProcessor">;
};

export function makeParser(vault: RequiredVault) {
    let processor: Processor = unified()
        .use(remarkParse)
        .use(remarkCallout, makeCalloutOptions())
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkWikiLink, makeRemarkWikiLinkOptions(vault))
        .use(remarkImageTransclusion, vault);

    if (vault.options?.setupProcessor) {
        processor = vault.options.setupProcessor(processor);
    }

    return function parse(doc: Compatible): ParseResult {
        const parsedAST = processor.parse(doc);
        const transformedAST = processor.runSync(parsedAST, doc);

        return {
            ast: transformedAST,
            frontmatter: matter(transformedAST),
        };
    };
}
