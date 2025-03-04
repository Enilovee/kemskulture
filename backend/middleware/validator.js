import { body, validationResult } from 'express-validator'


const userValidationRules = () => {
  return [
    // username must be an email
    body('name').trim().not().isEmpty().withMessage('name is required')
    .isLength({min:3,max:21}).withMessage('name must be within 3 to 21 characters'),
    body('email').isEmail().normalizeEmail().withMessage('invalid email'),
    // password must be at least 5 chars long
    body('password').trim().not().isEmpty().withMessage('passwords is empty')
    .isLength({min:8, max:25}).withMessage('password must be within 8 characters to 25 characters')
    .matches(/[A-Z]/).withMessage('password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('password must contain at least one number')
    .matches(/[\W_]/).withMessage('password must contain at least one special character'),
  ]
}

const validate = (req, res, next,) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  
  return res.status(400).json({
     errors: errors.array()
  })
}

export {
  userValidationRules,
  validate,
}