import * as fs from "node:fs";
import * as stream from "node:stream";

export class Asset {
    constructor(private absolutePath: string) {}

    read(): ReadableStream {
        const readStream = fs.createReadStream(this.absolutePath);

        return stream.Readable.toWeb(readStream);
    }
}
