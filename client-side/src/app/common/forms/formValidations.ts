import { createValidator } from "revalidate"

export const isValidEmail = createValidator(
  message => value => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return message
    }
  },
  'Invalid email address'
)

export const isFutureDate = createValidator(
  message => value => {
    const date = new Date(value);
    if (date.getTime() < new Date().getTime())
      return message;
  },
  field => `${field} must be a future date`
)

export const isGreaterThan = (n: number) => createValidator(
  message => value => {
    if (value && Number(value) <= n) {
      return message
    }
  },
  field => `${field} must be greater than ${n}`
)

export const isLessThan = (n: number) => createValidator(
  message => value => {
    if (value && Number(value) >= n) {
      return message
    }
  },
  field => `${field} must be greater than ${n}`
)

export const hasUppercase = createValidator(
  message => value => {
    if (value && !/[A-Z]/.test(value)) {
      return message
    }
  },
  field => `${field} must have an uppercase letter`
)

export const teamName = createValidator(
  message => value => {
    if (value && !/^[a-zA-Z0-9 ]+$/.test(value)) {
      return message
    }
  },
  'team name must only contain letters and numbers'
)

export const lettersAndNumbers = createValidator(
  message => value => {
    if (value && !/^[a-zA-Z0-9 ]+$/.test(value)) {
      return message
    }
  },
  field => `${field} must only contain letters and numbers`
)


