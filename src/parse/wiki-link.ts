import * as path from "node:path";
import remarkWikiLink from "remark-wiki-link";

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

export function makeOptions(
    options: MakeOptionsOptions,
): Partial<RemarkWikiLinkOptions> {
    // `hrefTemplate` needs access to the page we're trying to resolve, so we're
    // counting on the resolver running right before the `href` templater in order
    // to capture that state when we can.
    // This is probably dangerous, but for now it gets the behavior we need
    let pageBeingResolved: string | undefined;

    return {
        aliasDivider: "|",

        permalinks: options.permalinks,

        pageResolver(pageName) {
            pageBeingResolved = pageName;

            return options.permalinks.filter((permalink) => {
                return permalink.includes(pageName);
            });
        },

        hrefTemplate(permalink) {
            // Files does not exist
            if (permalink === "") {
                return `obsidian://open?file=${pageBeingResolved}`;
            }

            const type = options.href(permalink);
            const parsed = path.parse(permalink);

            switch (type.type) {
                // Route "internal" links within the app
                case "internal":
                    return `/recipes/${parsed.name}`;
                // Route "external" links to Obsidian
                case "external":
                    return `obsidian://open?file=${parsed.name}`;
            }
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

declare module "mdast" {
    interface PhrasingContentMap {
        wikiLink: {
            type: "wikiLink";
            data: WikiLinkData;
        };
    }
}
