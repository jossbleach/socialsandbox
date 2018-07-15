const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  //If data.name is not empty, it's going to be data.name, if it is then it's going to be an empty string

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Please enter your email address.";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Please enter a password.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
