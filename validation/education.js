const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  //If data.name is not empty, it's going to be data.name, if it is then it's going to be an empty string

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.field = !isEmpty(data.field) ? data.field : "";
  data.dateFrom = !isEmpty(data.dateFrom) ? data.dateFrom : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "Please enter the school that you attended.";
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree =
      "Please enter the degree you received/are expected to receive.";
  }
  if (Validator.isEmpty(data.field)) {
    errors.field = "Please enter your field of study.";
  }
  if (Validator.isEmpty(data.dateFrom)) {
    errors.dateFrom =
      "Please input the date that you started working at this company.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
