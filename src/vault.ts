import glob from "fast-glob";
import { read } from "to-vfile";
import { LazyGetter } from "lazy-get-decorator";

import { Asset } from "./asset.js";
import { File, type FilePath } from "./file.js";
import { isFile, isAsset, relative } from "./path.js";
import { type DBOptions, normalizeOptions } from "./options.js";
import { makeParser } from "./parse/remark.js";

export class Vault {
    /// MARK: Private Instance Properties

    private store = new Map<FilePath, File | Asset>();

    /// MARK: Public Instance Properties

    readonly options: DBOptions;

    /// MARK: Initialization

    protected constructor(options: DBOptions) {
        this.options = normalizeOptions(options);
    }

    static async init(options: DBOptions): Promise<Vault> {
        const db = new Vault(options);

        const files = await glob(`${options.vaultPath}/**/*`, {
            ignore: [
                // We don't want to crawl the Obsidian metadata directory
                ".obsidian",
            ],
        });

        for (const filePath of files) {
            if (isFile(filePath)) {
                await db.addFile(filePath);
            }

            if (isAsset(filePath)) {
                db.addAsset(filePath);
            }
        }

        return db;
    }

    private async addFile(absolutePath: string): Promise<void> {
        const vfile = await read(absolutePath);
        const file = new File(this, vfile);
        const relativePath = relative(absolutePath, this.options);

        this.store.set(relativePath as FilePath, file);
    }

    private addAsset(absolutePath: string): void {
        const asset = new Asset(/* absolutePath */);
        const relativePath = relative(absolutePath, this.options);

        this.store.set(relativePath as FilePath, asset);
    }

    /// MARK: Public Instance API

    @LazyGetter()
    get parse(): ReturnType<typeof makeParser> {
        return makeParser(this);
    }

    externalize(filePath: FilePath): string {
        return this.options.externalize(filePath);
    }

    resolvePath(reference: string, from?: File): FilePath | undefined {
        const possibleFilePath = reference as FilePath;

        if (this.store.has(possibleFilePath)) {
            return possibleFilePath;
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
     * @returns list of files contained in the DB
     */
    index(): string[] {
        return Array.from(this.store.keys());
    }
}
