const db = require('../../data/db-config');

const find = async () => { 
  const schemes = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .select('sc.scheme_id as scheme_id', 'sc.scheme_name')
    .groupBy('sc.scheme_id')
    .count('st.step_number as number_of_steps');
  
  return schemes;
}

const findById = async (scheme_id) => { 
  const rawSchemeData = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .select('sc.scheme_name', 'st.*')
    .where('sc.scheme_id', '=', `${scheme_id}`)
    .orderBy('st.step_number');
  
  const organizedSchemes = rawSchemeData.reduce((acc, scheme) => {
    const { instructions, scheme_name, step_id, step_number } = scheme;
    if (acc[scheme_name]) {
      acc[scheme_name].steps.push({ step_id, step_number, instructions });
    } else {
      if (!step_id) {
        acc[scheme_name] = {
          scheme_id: scheme_id,
          scheme_name: scheme_name,
          steps: []
        }
      } else {
          acc[scheme_name] = {
            scheme_id: scheme_id,
            scheme_name: scheme_name,
            steps: [{ step_id, step_number, instructions }]
          }
      }
    }
    return acc;
  }, {});
    
  return organizedSchemes;
}

const findSteps = async (scheme_id) => { 
  
  const rawSchemeData = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .select('st.step_id', 'st.step_number', 'st.instructions','sc.scheme_name')
    .where('sc.scheme_id', '=', `${scheme_id}`)
    .orderBy('st.step_number');

  if (!rawSchemeData[0].step_id) {
    return [];
  } else {
    return rawSchemeData;
  }

}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
