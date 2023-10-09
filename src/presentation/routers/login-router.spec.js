import { MissingParamError } from '../../utils/errors/missing-param-error.js'
import { UnauthorizedError } from '../errors/unauthorized-error.js'
import { LoginRouter } from './login-router.js'

const makeSUT = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut,
    authUseCaseSpy
  }
}

describe('Login Router', () => {
  it('should return 400 if no email is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSUT()
    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if an invalid httpRequest is provided', () => {
    const { sut } = makeSUT()
    const httpResponse = sut.route({})

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should call AuthUseCaseSpy with correct params', () => {
    const { sut, authUseCaseSpy } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSUT()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSUT()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  it('should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('should return 500 if no AuthUseCase is provided', () => {
    class AuthUseCaseSpy {}

    const sut = new LoginRouter(new AuthUseCaseSpy())
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })
})
