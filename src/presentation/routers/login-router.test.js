const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')

const makeSut = () => {
  class AuthUseCase {
    auth(email, password) {
      this.email = email
      this.password = password
    }
  }
  const authUseCase = new AuthUseCase()
  const sut = new LoginRouter(authUseCase)

  return { sut, authUseCase }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        password: 'any_password',
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpResponse is provided', () => {
    const { sut } = makeSut(); // sut = system under test
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut(); // sut = system under test
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should cal AuthUseCase with correct params', () => {
    const { sut, authUseCase } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      }
    }
    sut.route(httpRequest)
    expect(authUseCase.email).toBe(httpRequest.body.email)
    expect(authUseCase.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 when invalid credentials are provided', () => {
    const { sut } = makeSut(); // sut = system under test
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password',
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
})