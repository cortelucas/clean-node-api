import validator from 'validator'

export class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}
