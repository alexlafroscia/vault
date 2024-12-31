import remarkWikiLink from "remark-wiki-link";

import type { Vault } from "../vault.js";
import type { FilePath } from "../file.js";

interface RemarkWikiLinkOptions {
    aliasDivider: string;
    permalinks: string[];
    pageResolver?: (pageName: string) => string[];
    hrefTemplate?: (permalink: string) => string;
}

type HrefType = { type: "internal" } | { type: "external" };

export interface MakeOptionsOptions {
    permalinks: string[];
    href: (permalink: string) => HrefType;
}

export type RequiredDB = Pick<Vault, "externalize" | "index">;

export function makeOptions(db: RequiredDB): RemarkWikiLinkOptions {
    return {
        aliasDivider: "|",

        get permalinks() {
            return db.index();
        },

        pageResolver(pageName) {
            return db.index().filter((filePath) => filePath.includes(pageName));
        },

        hrefTemplate(permalink) {
            // `permalink` has already been resolved; we can treat it
            // like a validated `FilePath`
            return db.externalize(permalink as FilePath);
        },
    };
}

export { remarkWikiLink };

interface WikiLinkProperties {
    className: string;
    href: string;
}

interface WikiLinkData {
    alias: string;
    exists: boolean;
    hName: "a";
    permalink: string;
    hProperties: WikiLinkProperties;
}

export interface WikiLink {
    type: "wikiLink";
    data: WikiLinkData;
}

declare module "mdast" {
    interface PhrasingContentMap {
        wikiLink: WikiLink;
    }
}
