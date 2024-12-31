import { expect, test } from "vitest";
import dedent from "dedent";

import { makeParser } from "~test/helpers/remark";

test("basic markdown", () => {
    const parse = makeParser();
    const { ast, frontmatter } = parse(dedent`
        # Heading 1

        Paragraph Text
    `);

    expect(ast).toMatchSnapshot();
    expect(frontmatter).toEqual({});
});

test("frontmatter extraction", () => {
    const parse = makeParser();
    const { ast, frontmatter } = parse(dedent`
        ---
        foo: bar
        ---

        # Heading 1
    `);

    expect(ast).toMatchSnapshot();
    expect(frontmatter).toEqual({
        foo: "bar",
    });
});
