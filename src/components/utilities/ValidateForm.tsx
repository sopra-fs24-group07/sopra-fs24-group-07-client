import PropTypes from "prop-types";


// VALIDATE REGISTRATION AND EDIT USER PROFILE
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


//VALIDATE TEAM CREATION AND EDIT
export const validateTeamForm = ({
                                   teamName,
                                   teamDescription,
                                           setErrors,
                                           setIsLoading,
                                         }) => {
  let isValid = true;
  let errors = { teamName: "", teamDescription: "" };
  if (!teamName) {
    errors.teamName = "Team name is required";
    isValid = false;
  } else if (teamName.length > 50) {
    errors.teamName = "The name exceeds 50 characters";
    isValid = false;
  }

  if (!teamDescription) {
    errors.teamDescription = "The description is required"; //Since edit is not available
    isValid = false;
  }

  if (teamDescription.length > 500) {
    errors.teamDescription = "The description exceeds 500 characters";
    isValid = false;
  }

  setErrors(errors);
  setIsLoading(false);

  return isValid;
};

validateTeamForm.propTypes = {
  teamName: PropTypes.string,
  teamDescription: PropTypes.string,
  setErrors: PropTypes.func,
  setIsLoading: PropTypes.func,
};

//VALIDATE TASKS
export const validateTaskForm = ({
                                   title,
                                   description,
                                   setErrors,
                                   setIsLoading,
                                 }) => {
  let isValid = true;
  let errors = { title: "", description: "" };

  if (!title) {
    errors.title = "Title is required";
    isValid = false;
  }

  if (title && title.length > 100) {
    errors.title = "Title exceeds the 100 character limit";
    isValid = false;
  }

  if (description && description.length > 500) {
    errors.description = "Description exceeds the 500 character limit";
    isValid = false;
  }

  setErrors(errors);
  setTimeout(() => {}, 500);
  setIsLoading(false);

  return isValid;
};

validateTaskForm.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  setErrors: PropTypes.func,
  setIsLoading: PropTypes.func,
};