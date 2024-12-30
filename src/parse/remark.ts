import type { Root } from "mdast";
import type { Compatible } from "vfile";
import { unified } from "unified";
import remarkParse from "remark-parse";

import { remarkCallout, makeOptions as makeCalloutOptions } from "./callout.js";
import { type Frontmatter, remarkFrontmatter, matter } from "./frontmatter.js";
import {
    remarkImageTransclusion,
    type RemarkImageTransclusionOptions,
} from "./transclusion.js";
import {
    remarkWikiLink,
    makeOptions as makeRemarkWikiLinkOptions,
    type MakeOptionsOptions as MakeRemarkWikiLinkOptionsOptions,
} from "./wiki-link.js";

export interface ParseResult {
    ast: Root;
    frontmatter: Frontmatter;
}

export interface MakeParserOptions
    extends Partial<MakeRemarkWikiLinkOptionsOptions>,
        Partial<RemarkImageTransclusionOptions> {}

export function makeParser(options: MakeParserOptions = {}) {
    const parser = unified()
        .use(remarkParse)
        .use(remarkCallout, makeCalloutOptions())
        .use(remarkFrontmatter, ["yaml"])
        .use(
            remarkWikiLink,
            makeRemarkWikiLinkOptions({
                // Defaults
                permalinks: [],
                href(permalink) {
                    return { type: "external", permalink };
                },

                // Overrides
                ...options,
            }),
        )
        .use(remarkImageTransclusion, options);

    return function parse(doc: Compatible): ParseResult {
        const parsedAST = parser.parse(doc);
        const transformedAST = parser.runSync(parsedAST, doc);

        return {
            ast: transformedAST,
            frontmatter: matter(transformedAST),
        };
    };
}
