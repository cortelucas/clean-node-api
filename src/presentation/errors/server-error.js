export class ServerError extends Error {
  constructor (paramName) {
    super('Internal error')
    this.name = 'ServerError'
  }
}
