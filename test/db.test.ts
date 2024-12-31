import { expect, test } from "vitest";

import { Asset } from "~/asset";
import { File } from "~/file";
import { fixture } from "~test/helpers/fixture";

test("initializing the DB", async () => {
    const db = await fixture("basic");

    expect(db.resolve("First.md")).toBeInstanceOf(File);
    expect(db.resolve("Second.md")).toBeInstanceOf(File);
    expect(db.resolve("obsidian-icon.png")).toBeInstanceOf(Asset);

    expect(db.resolve("Unknown.md")).toBeUndefined();
});
