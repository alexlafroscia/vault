import { makeParser as baseMakeParser } from "~/parse/remark";
import { Vault } from "~/vault";

class UnitTestVault extends Vault {
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

export function makeParser(modify: (vault: UnitTestVault) => void = () => {}) {
    const vault = new UnitTestVault();

    modify(vault);

    return baseMakeParser(vault);
}
