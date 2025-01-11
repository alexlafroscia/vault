import type { Processor } from "./parse/remark.js";

export interface DBOptions {
    /**f
     * The absolute path to the Obsidian vault
     */
    vaultPath: string;

    /**
     * Translate an "internal" path within the vault into the "external"
     * path that the file can be fetched from.
     *
     * This is used to resolve embedded assets or internal links within files
     */
    externalize(internalPath: string): string;

    /**
     * Allows for modifying the `unified` processor to add additional plugins
     */
    setupProcessor?: (Processor: Processor) => Processor;
}

export function normalizeOptions(options: DBOptions): DBOptions {
    const { vaultPath, ...rest } = options;

    return {
        vaultPath: ensureTrailingSlash(vaultPath),
        ...rest,
    };
}

function ensureTrailingSlash(input: string): string {
    if (input.endsWith("/")) {
        return input;
    }

    return input + "/";
}
