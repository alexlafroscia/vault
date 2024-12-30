import { expect, test } from "vitest";
import dedent from "dedent";
import { find } from "unist-util-find";

import { makeParser } from "../../src/parse/remark";

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

test("when the file does not exist", () => {
    const parse = makeParser({
        href: () => ({ type: "internal" }),
    });
    const { ast } = parse(dedent`
			[[Mashed Potatoes]]
		`);

    const wikiLink = find(ast, { type: "wikiLink" });

    expect(wikiLink).toEqual(
        expect.objectContaining({
            type: "wikiLink",
            data: expect.objectContaining({
                permalink: "",
                exists: false,
                hName: "a",
                hProperties: {
                    className: "internal new",
                    href: "obsidian://open?file=Mashed Potatoes",
                },
            }),
        }),
    );
});

test("when the file is not a recipe", () => {
    const parse = makeParser({
        permalinks: ["Foo/A Link.md"],
        href: () => ({ type: "external" }),
    });
    const { ast } = parse(dedent`
			[[A Link|A Different Value]]
		`);

    const wikiLink = find(ast, { type: "wikiLink" });

    expect(wikiLink).toEqual(
        expect.objectContaining({
            type: "wikiLink",
            data: expect.objectContaining({
                permalink: "Foo/A Link.md",
                exists: true,
                hName: "a",
                hProperties: {
                    className: "internal",
                    href: "obsidian://open?file=A Link",
                },
            }),
        }),
    );
});

test("when the file is a recipe", () => {
    const parse = makeParser({
        permalinks: ["Recipes/Mashed Potatoes.md"],
        href: () => ({ type: "internal" }),
    });
    const { ast } = parse(dedent`
			[[Mashed Potatoes]]
		`);

    const wikiLink = find(ast, { type: "wikiLink" });

    expect(wikiLink).toEqual(
        expect.objectContaining({
            type: "wikiLink",
            data: expect.objectContaining({
                permalink: "Recipes/Mashed Potatoes.md",
                exists: true,
                hName: "a",
                hProperties: {
                    className: "internal",
                    href: "/recipes/Mashed Potatoes",
                },
            }),
        }),
    );
});

test("when the file is not a recipe", () => {
    const parse = makeParser({
        permalinks: ["Foo/A Link.md"],
        href: () => ({ type: "external" }),
    });
    const { ast } = parse(dedent`
			[[A Link|A Different Value]]
		`);

    const wikiLink = find(ast, { type: "wikiLink" });

    expect(wikiLink).toEqual(
        expect.objectContaining({
            type: "wikiLink",
            data: expect.objectContaining({
                permalink: "Foo/A Link.md",
                exists: true,
                hName: "a",
                hProperties: {
                    className: "internal",
                    href: "obsidian://open?file=A Link",
                },
            }),
        }),
    );
});
