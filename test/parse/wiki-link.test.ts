import { expect, test } from "vitest";
import dedent from "dedent";
import { find } from "unist-util-find";

import { makeParser } from "~test/helpers/remark";

test("without an alias", () => {
    const parse = makeParser();
    const { ast } = parse(dedent`
        [[A Link]]
    `);

    const wikiLink = find(ast, { type: "wikiLink" });

    expect(wikiLink).toEqual(
        expect.objectContaining({
            type: "wikiLink",
            data: expect.objectContaining({
                alias: "A Link",
            }),
        }),
    );
});

test("with an alias", () => {
    const parse = makeParser();
    const { ast } = parse(dedent`
        [[A Link|A Different Value]]
    `);

    const wikiLink = find(ast, { type: "wikiLink" });

    expect(wikiLink).toEqual(
        expect.objectContaining({
            type: "wikiLink",
            data: expect.objectContaining({
                alias: "A Different Value",
            }),
        }),
    );
});
