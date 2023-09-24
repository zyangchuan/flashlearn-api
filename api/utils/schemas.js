const emailSchema = {
  notEmpty: true,
  isEmail: true,
  isLength: { options: { max: 50 } }
}

const usernameSchema = {
  notEmpty: true,
  isLength: { options: { min: 3, max: 20 } }
}

const passwordSchema = { 
  notEmpty: true,
  isStrongPassword:
    {
      options: {
        minLength: 8,
        minUppercase: 0,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0
      }
    },
  isLength: { options: { max: 80 } }
}

module.exports = {
  emailSchema,
  usernameSchema,
  passwordSchema
}