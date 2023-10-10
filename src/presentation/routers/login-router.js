import { InvalidParamError } from '../../utils/errors/invalid-param-error.js'
import { MissingParamError } from '../../utils/errors/missing-param-error.js'
import { HTTPResponse } from '../helpers/http-response.js'

export class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HTTPResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HTTPResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HTTPResponse.badRequest(new MissingParamError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HTTPResponse.unauthorizedError()
      }

      return HTTPResponse.ok({ accessToken })
    } catch (error) {
      console.error(error)
      return HTTPResponse.serverError()
    }
  }
}
