import PropTypes from "prop-types";

export const validateRegistrationForm = ({
  username,
  name,
  password,
  repPassword,
  setErrors,
  setIsLoading,
}) => {
  let isValid = true;
  let errors = { username: "", name: "", password: "", repPassword: "" };

  if (!username) {
    errors.username = "Username is required";
    isValid = false;
  }

  if (username.length > 100) {
    errors.username = "Username exceeds the 100 character limit!";
    isValid = false;
  }

  if (!name) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (name.length > 100) {
    errors.name = "Name exceeds the 100 character limit!";
    isValid = false;
  }

  if (repPassword !== password) {
    errors.password = "The passwords do not match";
    isValid = false;
  }

  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
    isValid = false;
  }

  if (password.length > 100) {
    errors.password = "Password exceeds the 100 character limit";
    isValid = false;
  }

  setErrors(errors);
  setTimeout(() => {
    setIsLoading(false);
  }, 500);

  return isValid;
};

validateRegistrationForm.propTypes = {
  username: PropTypes.string,
  name: PropTypes.string,
  password: PropTypes.string,
  repPassword: PropTypes.string,
  setErrors: PropTypes.func,
  setIsLoading: PropTypes.func,
};
