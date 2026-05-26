import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    
    .email("Please enter a valid email address")
    .test("at-check", "Missing @ symbol", (value) => {
      // The actual alert is handled in the component onSubmit
      // but we use this test to identify the specific error case
      if (value && !value.includes("@")) {
        return false;
      }
      return true;
    }),
  password: yup
    .string()
    
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*#?&]/, "Must contain at least one special character"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*#?&]/, "Must contain at least one special character"),
  confirmPassword: yup
    .string()
    
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
