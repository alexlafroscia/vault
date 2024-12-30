import type { DBOptions } from "./options.js";

export function isFile(path: string) {
    return path.endsWith(".md");
}

export function isAsset(path: string) {
    return path.endsWith(".png");
}

export function relative(path: string, options: DBOptions) {
    return path.replace(options.vaultPath, "");
}
