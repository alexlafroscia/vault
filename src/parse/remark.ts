import type { Compatible } from "vfile";
import { unified } from "unified";
import remarkParse from "remark-parse";

import { remarkCallout, makeOptions as makeCalloutOptions } from "./callout.js";
import { type Frontmatter, remarkFrontmatter, matter } from "./frontmatter.js";
import type { Root } from "../mdast.js";
import {
    remarkImageTransclusion,
    type RequiredDB as TransclusionDBRequirements,
} from "./transclusion.js";
import {
    remarkWikiLink,
    makeOptions as makeRemarkWikiLinkOptions,
    type RequiredDB as WikiLinkDBRequirements,
} from "./wiki-link.js";

export interface ParseResult {
    ast: Root;
    frontmatter: Frontmatter;
}

type RequiredDB = TransclusionDBRequirements & WikiLinkDBRequirements;

export function makeParser(db: RequiredDB) {
    const parser = unified()
        .use(remarkParse)
        .use(remarkCallout, makeCalloutOptions())
        .use(remarkFrontmatter, ["yaml"])
        .use(remarkWikiLink, makeRemarkWikiLinkOptions(db))
        .use(remarkImageTransclusion, db);

    return function parse(doc: Compatible): ParseResult {
        const parsedAST = parser.parse(doc);
        const transformedAST = parser.runSync(parsedAST, doc);

        return {
            ast: transformedAST,
            frontmatter: matter(transformedAST),
        };
    };
}
