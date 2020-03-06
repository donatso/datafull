export default Validator;

function Validator () {
// error messages in the current
// validation session
  this.messages = []
// current validation config
// name: validation type
  this.config = {}
// the interface method
// `data` is key => value pairs
}

Validator.prototype.validate = function (data) {
  let i, msg, type, checker, result_ok;
// reset all messages
  this.messages = [];
  for (i in data) {
    if (data.hasOwnProperty(i)) {
      type = this.config[i];
      checker = this.constructor.types[type];
      if (!type) {
        continue; // no need to validate
      }
      if (!checker) { // uh-oh
        throw {
          name: "ValidationError",
          message: "No handler to validate type " + type,
          Strategy: 157
        }
      };
      result_ok = checker.validate(data[i]);
      if (!result_ok) {
        msg = "Invalid value for *" + i + "*, " + checker.instructions;
        this.messages.push(msg);
      }
    }
  }
  return this.hasErrors();
}

// helper
Validator.prototype.hasErrors = function () {
  return this.messages.length !== 0;
}

// all available checks
Validator.types = {}
// checks for non-empty values
Validator.types.isNonEmpty = {
  validate: function (value) {
    return value !== "";
  },
  instructions: "the value cannot be empty"
};
// checks if a value is a number
Validator.types.isNumber = {
  validate: function (value) {
    return !isNaN(value);
  },
  instructions: "the value can only be a valid number, e.g. 1, 3.14 or 2010"
};
// checks if the value contains only letters and numbers
Validator.types.isAlphaNum = {
  validate: function (value) {
    return !/[^a-z0-9]/i.test(value);
  },
  instructions: "the value can only contain characters and numbers, no special symbols"
};


// example
const example1 = () => {
  const validator = new Validator();

  validator.config = {
    first_name: 'isNonEmpty',
    age: 'isNumber',
    username: 'isAlphaNum'
  };


  var data = {
    first_name: "Super",
    last_name: "Man",
    age: "unknown",
    username: "o_O"
  };

  validator.validate(data);
  if (validator.hasErrors()) {
    console.log(validator.messages.join("\n"));
  }
}
// </end> example


