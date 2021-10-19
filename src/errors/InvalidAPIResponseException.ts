export class InvalidAPIResponseException extends Error {
  constructor(public readonly data: any, public parentError: Error) {
    super('MTA request failed');
  }
}
