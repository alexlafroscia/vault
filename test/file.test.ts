import { expect, test, vi } from "vitest";

import { File } from "~/file";
import { fixture } from "~test/helpers";

test("caching the parsed AST", async () => {
    const db = await fixture("basic");
    const file = db.resolve("First.md") as File;

    const parse = vi.spyOn(db, "parse");

    expect(parse, "File is not eagerly parsed").not.toHaveBeenCalled();

    file.ast;

    expect(parse, "File has now been parsed").toHaveBeenCalledTimes(1);

    file.ast;

    expect(parse, "File was not parsed a second time").toHaveBeenCalledTimes(1);
});
