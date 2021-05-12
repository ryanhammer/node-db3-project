const Schemes = require('./scheme-model');

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const scheme = await Schemes.getById(id);
    if (!scheme) {
      res.status(404).json({
        message: `scheme with scheme_id ${id} is not found`
      });
    } else {
      req.scheme = scheme;
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const name = req.body.scheme_name;
  if (!name || name.trim().length === 0 || typeof name !== 'string') {
    res.status(400).json({
      message: "invalid scheme_name"
    });
  } else {
    req.body.scheme_name = name.trim();
    next();
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const instructions = req.body.instructions;
  const step_number = req.body.step_number;
  if (
    !instructions ||
    instructions.trim().length === 0 ||
    typeof instructions !== 'string' ||
    typeof step_number !== 'number' ||
    step_number < 1
    ) {
    res.status(400).json({
      message: "invalid step"
    });
  } else {
    req.body.instructions = instructions.trim();
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
