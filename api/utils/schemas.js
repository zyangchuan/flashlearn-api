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

const deckNameSchema = { 
  notEmpty: true,
  isLength: { options: { max: 80 } }
}

const deckDescriptionSchema = { 
  isLength: { options: { max: 200 } }
}

const cardQuestionSchema = { 
  notEmpty: true,
  isLength: { options: { max: 100 } }
}

const cardAnswerSchema = {
  isLength: { options: { max: 150 } }
}

module.exports = {
  emailSchema,
  usernameSchema,
  passwordSchema,
  deckNameSchema,
  deckDescriptionSchema,
  cardQuestionSchema,
  cardAnswerSchema
}