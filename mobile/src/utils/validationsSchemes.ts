import * as Yup from "yup";

export const registrationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Ім’я має бути не менше 2 символів")
    .max(50, "Ім’я має бути не більше 50 символів")
    .required("Ім’я обов’язкове"),

  lastName: Yup.string()
    .min(2, "Прізвище має бути не менше 2 символів")
    .max(50, "Прізвище має бути не більше 50 символів")
    .required("Прізвище обов’язкове"),

  email: Yup.string()
    .email("Введіть правильну пошту")
    .required("Пошта обов’язкова"),

  dateOfBirthday: Yup.object().shape({
    day: Yup.string().required("День народження обов’язковий"),
    month: Yup.string().required("Місяць народження обов’язковий"),
    year: Yup.string().required("Рік народження обов’язковий"),
  }),
});

export const phoneValidationSchema = Yup.object().shape({
  number: Yup.string()
    .matches(
      /^\d{2} \d{3} \d{2} \d{2}$/,
      "Phone number must be exactly 9 digits and contain only numbers"
    )
    .required("Phone number is required"),
});

export const otpValidationSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^\d{6}$/, "Code must be exactly 6 digits")
    .required("Code is required"),
});
export const settingsValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Ім’я має бути не менше 2 символів")
    .max(50, "Ім’я має бути не більше 50 символів")
    .required("Ім’я обов’язкове"),

  lastName: Yup.string()
    .min(2, "Прізвище має бути не менше 2 символів")
    .max(50, "Прізвище має бути не більше 50 символів")
    .required("Прізвище обов’язкове"),

  dateOfBirthday: Yup.object().shape({
    day: Yup.string().required("День народження обов’язковий"),
    month: Yup.string().required("Місяць народження обов’язковий"),
    year: Yup.string().required("Рік народження обов’язковий"),
  }),
   number: Yup.string()
    .matches(
      /^\d{2} \d{3} \d{2} \d{2}$/,
      "Phone number must be exactly 9 digits and contain only numbers"
    )
    .required("Phone number is required"),
     email: Yup.string()
    .email("Введіть правильну пошту")
    .required("Пошта обов’язкова"),
});