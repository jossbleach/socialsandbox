const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};
  //If data.name is not empty, it's going to be data.name, if it is then it's going to be an empty string

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Your handle must be between 2 and 40 characters.";
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "You must enter a handle.";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "You must enter a status.";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "You must enter some skills... I'm sure you have a couple.";
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Your website must be a valid URL.";
    }
  }
  //Social Networks
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Your YouTube account must be a valid URL.";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Your Twitter account must be a valid URL.";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Your Facebook account must be a valid URL.";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Your LinkedIn account must be a valid URL.";
    }
  }
  if (!isEmpty(data.behance)) {
    if (!Validator.isURL(data.behance)) {
      errors.behance = "Your Behance account must be a valid URL.";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Your Instagram account must be a valid URL.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
