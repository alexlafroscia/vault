export * from "mdast";

export interface CalloutData {
    dataCallout?: boolean;
    dataCalloutType?: string;
    open?: boolean;
}

export interface CalloutTitleData {
    dataCalloutTitle: boolean;
}

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
    interface BlockquoteData {
        hName?: string;
        hProperties?: CalloutData;
    }

    interface ParagraphData {
        hName?: string;
        hProperties?: CalloutTitleData;
    }

    interface PhrasingContentMap {
        wikiLink: WikiLink;
    }
}
