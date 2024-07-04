import * as yup from "yup";

export const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("Please enter a valid email*")
      .required("Email is a required field*"),
    password: yup
      .string()
      .required("Password is a required field*")
      .min(8, "Password must be at least 8 characters*")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number*"
      ),
  })
  .required();

export const singupSchema = yup
  .object()
  .shape({
    username: yup
      .string()
      .required("Name is a required field*")
      .matches(/^[a-zA-Z]*$/, "Only characters are allowed*"),
    email: yup
      .string()
      .email("Please enter a valid email*")
      .required("Email is a required field*"),
    password: yup
      .string()
      .required("Password is a required field*")
      .min(8, "Password must be at least 8 characters*")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number*"
      ),
  })
  .required();

export const taskSchema = yup
  .object()
  .shape({
    title: yup.string().required("Title is required field*"),
    description: yup.string().required("Description is required field"),
  })
  .required();
