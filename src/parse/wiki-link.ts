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

export type RequiredVault = Pick<Vault, "externalize" | "index">;

export function makeOptions(vault: RequiredVault): RemarkWikiLinkOptions {
    return {
        aliasDivider: "|",

        get permalinks() {
            return vault.index();
        },

        pageResolver(pageName) {
            return vault
                .index()
                .filter((filePath) => filePath.includes(pageName));
        },

        hrefTemplate(permalink) {
            // `permalink` has already been resolved; we can treat it
            // like a validated `FilePath`
            return vault.externalize(permalink as FilePath);
        },
    };
}

export { remarkWikiLink };
