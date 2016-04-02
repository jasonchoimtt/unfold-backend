import { Readable } from 'stream';


export class StringReadable extends Readable {
    constructor(source) {
        super();
        this.source = source;
        this.offset = 0;
        this.length = source.length;
    }

    _read(size) {
        if (this.offset < this.length) {
            this.push(this.source.slice(this.offset, this.offset + this.length));
            this.offset += size;
        } else {
            this.push(null);
        }
    }
}
