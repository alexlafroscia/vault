import { describe, expect, test } from "vitest";
import dedent from "dedent";
import { find } from "unist-util-find";

import { makeParser } from "../../src/parse/remark";

describe("image transclude", () => {
    test("without permalink match", () => {
        const parse = makeParser();
        const { ast } = parse(dedent`
			![[Some Image.png]]
		`);

        const image = find(ast, { type: "image" });

        expect(image).toMatchObject({
            type: "image",
            url: "Some Image.png",
            alt: undefined,
            position: expect.objectContaining({
                start: expect.anything(),
                end: expect.anything(),
            }),
        });
    });

    test("with permalink match", () => {
        const permalink = "Recipes/@attachments/Some Image.png";
        const parse = makeParser({
            resolve: () => permalink,
        });
        const { ast } = parse(dedent`
			![[Some Image.png]]
		`);

        const image = find(ast, { type: "image" });

        expect(image).toMatchObject({
            type: "image",
            url: permalink,
            alt: undefined,
            position: expect.objectContaining({
                start: expect.anything(),
                end: expect.anything(),
            }),
        });
    });

    test("with alt text", () => {
        const parse = makeParser();
        const { ast } = parse(dedent`
			![[Some Image.png|400]]
		`);

        const image = find(ast, { type: "image" });

        expect(image).toMatchObject({
            type: "image",
            url: "Some Image.png",
            alt: "400",
            position: expect.objectContaining({
                start: expect.anything(),
                end: expect.anything(),
            }),
        });
    });
});
