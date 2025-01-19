import type { VaultOptions } from "./options.js";

export function isFile(path: string) {
    return path.endsWith(".md");
}

export function isAsset(path: string) {
    return path.endsWith(".png") || path.endsWith(".jpg");
}

export function relative(path: string, options: VaultOptions) {
    return path.replace(options.vaultPath, "");
}
