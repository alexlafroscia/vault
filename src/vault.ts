import glob from "fast-glob";
import { read } from "to-vfile";

import { Asset } from "./asset.js";
import { memoized } from "./decorators/memoized.js";
import { File, type FilePath } from "./file.js";
import { isFile, isAsset, relative } from "./path.js";
import { type VaultOptions, normalizeOptions } from "./options.js";
import { makeParser } from "./parse/remark.js";

export class Vault {
    /// MARK: Private Instance Properties

    private store = new Map<FilePath, File | Asset>();

    /// MARK: Public Instance Properties

    readonly options: VaultOptions;

    /// MARK: Initialization

    protected constructor(options: VaultOptions) {
        this.options = normalizeOptions(options);
    }

    static async init(options: VaultOptions): Promise<Vault> {
        const vault = new Vault(options);

        const files = await glob(`${options.vaultPath}/**/*`, {
            ignore: [
                // We don't want to crawl the Obsidian metadata directory
                ".obsidian",
            ],
        });

        for (const filePath of files) {
            if (isFile(filePath)) {
                await vault.addFile(filePath);
            }

            if (isAsset(filePath)) {
                vault.addAsset(filePath);
            }
        }

        return vault;
    }

    private async addFile(absolutePath: string): Promise<void> {
        const vfile = await read(absolutePath);
        const file = new File(this, vfile);
        const relativePath = relative(absolutePath, this.options);

        this.store.set(relativePath as FilePath, file);
    }

    private addAsset(absolutePath: string): void {
        const asset = new Asset(absolutePath);
        const relativePath = relative(absolutePath, this.options);

        this.store.set(relativePath as FilePath, asset);
    }

    /// MARK: Public Instance API

    @memoized
    get parse(): ReturnType<typeof makeParser> {
        return makeParser(this);
    }

    externalize(filePath: FilePath): string {
        return this.options.externalize(filePath);
    }

    resolvePath(reference: string, from?: File): FilePath | undefined {
        const matches = this.index().filter((path) => {
            return path.includes(reference);
        });

        if (matches.length === 1) {
            return matches[0];
        }
    }

    /**
     * @param reference the file path to resolve
     * @param from the file to search from; useful if a partial path needs to be resolved
     * @returns the resolved file, if possible
     */
    resolve(reference: string, from?: File): File | Asset | undefined {
        const filePath = this.resolvePath(reference, from);

        if (filePath) {
            return this.store.get(filePath);
        }
    }

    /**
     * @returns list of files contained in the Vault
     */
    index(): FilePath[] {
        return Array.from(this.store.keys());
    }
}
