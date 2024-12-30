import { remarkCallout, type Options } from "@r4ai/remark-callout";

export function makeOptions(): Options {
    return {};
}

export { remarkCallout };

interface CalloutData {
    dataCallout?: boolean;
    dataCalloutType?: string;
    open?: boolean;
}

interface CalloutTitleData {
    dataCalloutTitle: boolean;
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
}
