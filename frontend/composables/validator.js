import { ref, computed } from "vue"

// Validator: A computed property that returns an error message
// if the input is invalid, otherwise returns false.

export const minLength = (limit) => {

  const validator = {
    validate: (value) => {
      if (value.length >= limit) {
        return { valid: true }
      } else {
        return { valid: false , errorMsg: "Must be at least " + limit + " characters long."}
      }
    },
    limit: limit
  }

  return validator
}

export const maxLength = (limit) => {

  const validator = {
    validate: (value) => {
      if (value.length <= limit) {
        return { valid: true }
      } else {
        return { valid: false , errorMsg: "Must not be longer than " + limit + " characters."}
      }
    },
    limit: limit
  }

  return validator
}

export const required = {
  validate: (value) => {
    if (value.length) {
      return { valid: true }
    } else {
      return { valid: false, errorMsg: "This field is required." }
    }
  }
}

export const validEmail = {
  validate: (value) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      return { valid: true }
    } else {
      return { valid: false, errorMsg: "Please enter a valid email." }
    }
  }
}

export const validPassword = {

  validate: (value) => {
    if ((/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/.test(value))) {
      return { valid: true }
    } else {
      return { valid: false , errorMsg: "Must contain both numbers and letters."}
    }
  }
}

export const checkMatch = (base) => {

  const validator = {
    validate: (value) => {
      if (value === base) {
        return { valid: true }
      } else {
        return { valid: false , errorMsg: "Password do not match."}
      }
    },
    base: base
  }

  return validator
}