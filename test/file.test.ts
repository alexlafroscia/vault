import { describe, expect, test, vi } from "vitest";
import { find } from "unist-util-find";

import { File } from "~/file";
import type { Image, WikiLink } from "~/mdast";
import { makeParser } from "~/parse/remark";
import { fixture } from "~test/helpers/fixture";

vi.mock("~/parse/remark", { spy: true });

test("caching the parsed AST", async () => {
    const vault = await fixture("basic");
    const file = vault.resolve("First.md") as File;

    expect(
        makeParser,
        "Parser is not immediately created",
    ).not.toHaveBeenCalled();

    file.ast;

    expect(
        makeParser,
        "Parser is created once an AST is requested",
    ).toHaveBeenCalledTimes(1);

    file.ast;

    expect(
        makeParser,
        "Parser was not created a second time",
    ).toHaveBeenCalledTimes(1);
});

describe("ast", () => {
    test("transcluding an asset", async () => {
        const vault = await fixture("basic", {
            externalize(path) {
                if (path.endsWith(".png")) {
                    return "/static/" + path;
                }

                return "/" + path;
            },
        });
        const file = vault.resolve("First.md") as File;

        const image: Image | undefined = find(file.ast, { type: "image" });

        expect(image?.url).toBe("/static/obsidian-icon.png");
    });

    describe("resolving wiki links", () => {
        test("when the linked file exists", async () => {
            const vault = await fixture("basic");
            const file = vault.resolve("First.md") as File;

            const wikiLink: WikiLink | undefined = find(file.ast, {
                type: "wikiLink",
                value: "Second",
            });

            expect(wikiLink?.data?.exists).toBe(true);
        });

        test("when the linked file does not exist", async () => {
            const vault = await fixture("basic");
            const file = vault.resolve("First.md") as File;

            const wikiLink: WikiLink | undefined = find(file.ast, {
                type: "wikiLink",
                value: "Third",
            });

            expect(wikiLink?.data?.exists).toBe(false);
        });
    });
});
