import { describe, expect, test, vi } from "vitest";
import dedent from "dedent";
import { find } from "unist-util-find";

import type { FilePath } from "~/file";
import { makeParser } from "~test/helpers/remark";

describe("image transclude", () => {
    test("with alt text", () => {
        const parse = makeParser((vault) => {
            vi.spyOn(vault, "resolvePath").mockReturnValue(
                "Some Image.png" as FilePath,
            );
        });
        const { ast } = parse(dedent`
			![[Some Image.png|400]]
		`);

        const image = find(ast, { type: "image" });

        expect(image).toMatchObject({
            type: "image",
            url: "/static/Some Image.png",
            alt: "400",
            position: expect.objectContaining({
                start: expect.anything(),
                end: expect.anything(),
            }),
        });
    });
});
