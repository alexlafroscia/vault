import { expect, test } from "vitest";

import { Asset } from "~/asset";
import { File } from "~/file";
import { fixture } from "~test/helpers/fixture";

test("initializing the DB", async () => {
    const vault = await fixture("basic");

    expect(vault.resolve("First.md")).toBeInstanceOf(File);
    expect(vault.resolve("Second.md")).toBeInstanceOf(File);
    expect(vault.resolve("obsidian-icon.png")).toBeInstanceOf(Asset);

    expect(vault.resolve("Unknown.md")).toBeUndefined();
});
