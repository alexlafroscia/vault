import type { Root, Image, Node, Paragraph } from "mdast";
import type { Plugin } from "unified";
import { visit, type Test } from "unist-util-visit";

function isParagraph(node: Node): node is Paragraph {
    return node.type === "paragraph";
}

const extractTransclusion = (node: Node) => {
    if (!isParagraph(node)) {
        return false;
    }

    if (node.children.length !== 1) {
        return false;
    }

    const [maybeTransclusion] = node.children;

    if (maybeTransclusion.type !== "text") {
        return false;
    }

    if (
        maybeTransclusion.value.startsWith("![[") &&
        maybeTransclusion.value.endsWith("]]")
    ) {
        return maybeTransclusion.value.replace("![[", "").replace("]]", "");
    }

    return false;
};

const isTransclusion: Test = (node) => {
    return !!extractTransclusion(node);
};

export interface RemarkImageTransclusionOptions {
    resolve?: (reference: string, from?: string) => string | undefined;
}

export const remarkImageTransclusion: Plugin<
    [RemarkImageTransclusionOptions],
    Root
> = (options) => {
    return function (tree, file) {
        visit(tree, isTransclusion, (node) => {
            let transclusion = extractTransclusion(node);

            if (!transclusion) {
                return;
            }

            let alt: string | undefined;
            [transclusion, alt] = transclusion.split("|");

            const imageReplacement: Image = {
                type: "image",
                url: options.resolve?.(transclusion, file.path) ?? transclusion,
                alt,
            };

            // Copy over updated `image` properties
            Object.assign(node, imageReplacement);

            // Remove original `childen` which images do not have
            delete (node as any).children;
        });
    };
};
