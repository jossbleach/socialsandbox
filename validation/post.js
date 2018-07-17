const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};
  //If data.name is not empty, it's going to be data.name, if it is then it's going to be an empty string

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Your post must be between 10 and 300 characters long.";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Please enter some text.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
