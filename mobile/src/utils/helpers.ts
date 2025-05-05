import { FormikErrors, FormikValues } from "formik";
export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  let formatted = digits;

  if (digits.length > 2) {
    formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  if (digits.length > 5) {
    formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5
    )}`;
  }
  if (digits.length > 7) {
    formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5,
      7
    )} ${digits.slice(7)}`;
  }

  return formatted.substring(0, 12);
};

export const areAllFieldsValid = (
  values: FormikValues,
  errors: FormikErrors<FormikValues>
): boolean => {
  const areAllFieldsFilled = Object.values(values).every((value) => {
    if (typeof value === "object" && value !== null) {
      return Object.values(value).every((v) => v !== "");
    }
    return value !== "";
  });

  const hasNoErrors = Object.keys(errors).length === 0;

  return areAllFieldsFilled && hasNoErrors;
};
