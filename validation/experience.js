const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};
  //If data.name is not empty, it's going to be data.name, if it is then it's going to be an empty string

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.dateFrom = !isEmpty(data.dateFrom) ? data.dateFrom : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Please enter a job title.";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Please enter a company name.";
  }
  if (Validator.isEmpty(data.title)) {
    errors.dateFrom =
      "Please input the date that you started working at this company.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
