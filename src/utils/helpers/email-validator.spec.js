import { EmailValidator } from './index.js'

describe('Email Validator', () => {
  it('should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@mail.com')

    expect(isEmailValid).toBe(true)
  })
})
