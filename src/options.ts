export interface DBOptions {
    /**f
     * The absolute path to the Obsidian vault
     */
    vaultPath: string;
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
