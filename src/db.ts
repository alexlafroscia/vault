import glob from "fast-glob";
import { read } from "to-vfile";

import { Asset } from "./asset.js";
import { File } from "./file.js";
import { isFile, isAsset, relative } from "./path.js";
import { type DBOptions, normalizeOptions } from "./options.js";
import { makeParser } from "./parse/remark.js";

export class DB {
    /// MARK: Private Instance Properties

    private options: DBOptions;
    private store = new Map<string, File | Asset>();

    /// MARK: Public Instance Properties

    readonly parse: ReturnType<typeof makeParser>;

    /// MARK: Initialization

    private constructor(options: DBOptions) {
        const db = this;

        this.options = normalizeOptions(options);
        this.parse = makeParser({
            get permalinks() {
                return db.index();
            },
        });
    }

    static async init(options: DBOptions): Promise<DB> {
        const db = new DB(options);

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

        this.store.set(relativePath, file);
    }

    private addAsset(absolutePath: string): void {
        const asset = new Asset(absolutePath);
        const relativePath = relative(absolutePath, this.options);

        this.store.set(relativePath, asset);
    }

    /// MARK: Public Instance API

    /**
     * @param reference the file path to resolve
     * @param from the file to search from; useful if a partial path needs to be resolved
     * @returns the resolved file, if possible
     */
    resolve(reference: string, from?: File): File | Asset | undefined {
        return this.store.get(reference);
    }

    /**
     * @returns list of files contained in the DB
     */
    index(): string[] {
        return Array.from(this.store.keys());
    }
}
