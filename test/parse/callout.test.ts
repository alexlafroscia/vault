import { expect, test } from "vitest";
import dedent from "dedent";
import { find } from "unist-util-find";

import { makeParser } from "~test/helpers/remark";

test("a callout with a title and body", () => {
    const parse = makeParser();
    const { ast } = parse(dedent`
        > [!note] A brief description
		> Body
    `);

    const callout = find(ast, { type: "blockquote" });

    expect(callout).toEqual(
        expect.objectContaining({
            type: "blockquote",
            data: {
                hName: "div",
                hProperties: {
                    dataCallout: true,
                    dataCalloutType: "note",
                    open: false,
                },
            },
            children: [
                expect.objectContaining({
                    type: "paragraph",
                    data: {
                        hName: "div",
                        hProperties: {
                            dataCalloutTitle: true,
                        },
                    },
                    children: [{ type: "text", value: "A brief description" }],
                }),
                expect.objectContaining({
                    type: "blockquote",
                    data: {
                        hName: "div",
                        hProperties: {
                            dataCalloutBody: true,
                        },
                    },
                    children: [
                        expect.objectContaining({
                            type: "paragraph",
                            children: [{ type: "text", value: "Body" }],
                        }),
                    ],
                }),
            ],
        }),
    );
});

test("a callout with only a title", () => {
    const parse = makeParser();
    const { ast } = parse(dedent`
        > [!tldr] A brief description
    `);

    const callout = find(ast, { type: "blockquote" });

    expect(callout).toEqual(
        expect.objectContaining({
            type: "blockquote",
            data: {
                hName: "div",
                hProperties: {
                    dataCallout: true,
                    dataCalloutType: "tldr",
                    open: false,
                },
            },
            children: [
                expect.objectContaining({
                    type: "paragraph",
                    data: {
                        hName: "div",
                        hProperties: {
                            dataCalloutTitle: true,
                        },
                    },
                    children: [{ type: "text", value: "A brief description" }],
                }),
            ],
        }),
    );
});

test("a callout with only a body", () => {
    const parse = makeParser();
    const { ast } = parse(dedent`
        > [!warning] 
		> This is a warning
    `);

    const callout = find(ast, { type: "blockquote" });

    expect(callout).toEqual(
        expect.objectContaining({
            type: "blockquote",
            data: {
                hName: "div",
                hProperties: {
                    dataCallout: true,
                    dataCalloutType: "warning",
                    open: false,
                },
            },
            children: [
                expect.objectContaining({
                    type: "paragraph",
                    data: {
                        hName: "div",
                        hProperties: {
                            dataCalloutTitle: true,
                        },
                    },
                    children: [{ type: "text", value: "Warning" }],
                }),
                expect.objectContaining({
                    type: "blockquote",
                    data: {
                        hName: "div",
                        hProperties: {
                            dataCalloutBody: true,
                        },
                    },
                    children: [
                        expect.objectContaining({
                            type: "paragraph",
                            children: [
                                { type: "text", value: "This is a warning" },
                            ],
                        }),
                    ],
                }),
            ],
        }),
    );
});
