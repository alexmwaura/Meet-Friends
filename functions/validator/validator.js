const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(regex)) return true;
  else return false;
};

// post validators
exports.validatePostData = (data) => {
  let errors = {};

  if (isEmpty(data.title)) errors.title = "Must not be empty";
  if (isEmpty(data.post)) errors.post = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// post reducers
exports.postReducers = (data) => {
  let postData = {};

  if (!isEmpty(data.category)) postData.category = data.category;
  if (data.website.trim().substring(0, 4))
    postData.website = `http://${data.website.trim()}`;
  postData.website = data.website;

  return postData;
};

exports.validateSignupData = (user) => {
  let errors = {};

  if (isEmpty(user.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(user.email)) {
    errors.email = "Must be a valid email";
  }
  if (isEmpty(user.username)) errors.username = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";
  if (user.password !== user.confirmPassword) {
    errors.confirmPassword = "Password must match";
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = 'Must not be Empty';
  if (isEmpty(data.password)) errors.password = 'Must not be Empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}