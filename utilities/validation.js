

//signup validation 

function emailValidation(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function passwordValidation(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}
function validationFields(fields) {
  return fields.every((fields) => fields);
}

function ConfirmPassword(password, ConfirmPassword) {
  return password == ConfirmPassword;
}
module.exports = {
  emailValidation,
  passwordValidation,
  validationFields,
  ConfirmPassword,
};
