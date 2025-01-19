import { expect, test, vi } from "vitest";
import dedent from "dedent";

import { makeParser } from "~test/helpers/remark";
import { Plugin } from "unified";

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

test("customizing the processor", () => {
    const handle = vi.fn();
    const plugin: Plugin = vi.fn().mockReturnValue(handle);
    const setupProcessor = vi
        .fn()
        .mockImplementation((processor) => processor.use(plugin));

    const parse = makeParser((vault) => {
        vault.options.setupProcessor = setupProcessor;
    });

    expect(setupProcessor).toHaveBeenCalledOnce();

    parse(dedent`
       Testing 
    `);

    expect(handle).toHaveBeenCalledWith(
        // AST
        expect.anything(),
        // VFile
        expect.anything(),
    );
});
