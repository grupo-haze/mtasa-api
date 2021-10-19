export declare class InvalidAPIResponseException extends Error {
    readonly data: any;
    parentError: Error;
    constructor(data: any, parentError: Error);
}
