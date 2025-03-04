import { body, validationResult } from 'express-validator'


const useResetValidationRules = () => {
  return [
    body('newPassword').trim().not().isEmpty().withMessage('password is empty')
    .isLength({min:8, max:25}).withMessage('password must be within 8 characters to 25 characters')
    .matches(/[A-Z]/).withMessage('password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('password must contain at least one number')
    .matches(/[\W_]/).withMessage('password must contain at least one special character'),
  ]
}

const resetValidate = (req, res, next,) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  
  return res.status(400).json({
     errors: errors.array()
  })
}

export {
  useResetValidationRules,
  resetValidate,
}