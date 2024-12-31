import * as path from "node:path";

import { Vault } from "~/vault";
import type { DBOptions } from "~/options";

type Fixture = "basic";

export function fixture(
    fixture: Fixture,
    options: Partial<Omit<DBOptions, "vaultPath">> = {},
): Promise<Vault> {
    return Vault.init({
        vaultPath: path.resolve(__dirname, "../fixtures", fixture),

        externalize(path) {
            return `/` + path;
        },

        ...options,
    });
}
