import { makeParser as baseMakeParser } from "~/parse/remark";
import { Vault } from "~/vault";

class UnitTestDB extends Vault {
    constructor() {
        super({
            vaultPath: "",

            externalize(internalPath) {
                if (internalPath === "") {
                    return `obsidian://open?file=${internalPath}`;
                }

                if (internalPath.endsWith(".png")) {
                    return "/static/" + internalPath;
                }

                return "/" + internalPath;
            },
        });
    }
}

export function makeParser(modifyDB: (db: UnitTestDB) => void = () => {}) {
    const db = new UnitTestDB();

    modifyDB(db);

    return baseMakeParser(db);
}
