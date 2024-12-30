import { describe, expect, test } from "vitest";

import { normalizeOptions } from "~/options";

describe("normalizeOptions", () => {
    describe("vaultPath", () => {
        test("when the path ends with a `/`", () => {
            const { vaultPath } = normalizeOptions({
                vaultPath: "/foo/",
            });

            expect(vaultPath).toBe("/foo/");
        });

        test("when the path does not end with a `/`", () => {
            const { vaultPath } = normalizeOptions({
                vaultPath: "/foo",
            });

            expect(vaultPath).toBe("/foo/");
        });
    });
});
