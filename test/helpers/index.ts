import * as path from "node:path";

import { DB } from "~/db";
import type { DBOptions } from "~/options";

type Fixture = "basic";

export function fixture(
    fixture: Fixture,
    options: Omit<DBOptions, "vaultPath"> = {},
): Promise<DB> {
    return DB.init({
        ...options,

        vaultPath: path.resolve(__dirname, "../fixtures", fixture),
    });
}
