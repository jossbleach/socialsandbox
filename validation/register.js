const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  //If data.name is not empty, it's going to be data.name, if it is then it's going to be an empty string
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Please enter your name.";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Please enter your email address.";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Please enter a password.";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters long.";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Please confirm your password.";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Your passwords do not match.";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
