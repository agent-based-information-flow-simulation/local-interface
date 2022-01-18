import { store } from "./store";

const reserved_names = [
  "send",
  "connections",
  "rcv",
  "len",
  "round",
  "list",
  "filter",
  "self",
  "datetime",
  "random",
  "numpy",
  "json",
  "spade",
  "copy",
  "uuid",
  "get_json_from_spade_message",
  "get_spade_message",
  "backupbehaviour",
  "backup_url",
  "backup_period",
  "backup_delay",
  "false",
  "none",
  "true",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
];

export const FIPACommActs = [
  "AcceptProposal",
  "Agree",
  "Cancel",
  "CallForProposal",
  "Confirm",
  "Disconfirm",
  "Failure",
  "Inform",
  "InformIf",
  "InformRef",
  "NotUnderstood",
  "Propagate",
  "Propose",
  "Proxy",
  "QueryIf",
  "QueryRef",
  "Refuse",
  "RejectProposal",
  "Request",
  "RequestWhen",
  "RequestWhenever",
  "Subscribe",
];

const format = /[!@#$%^&*()+`\-=[\]{};':"\\|,.<>/?]+/;

export const errorCodes = [
  /*
  1XX - name errors
  2XX - performative errors
  3XX - value errors
  4XX - distribution errors
  5XX - enum errors
  9XX - other errors
  */
  {
    code: 101,
    info: "Name cannot be duplicate!",
  },
  {
    code: 102,
    info: "Name cannot contain whitespaces!",
  },
  {
    code: 103,
    info: "Name cannot start with a number!",
  },
  {
    code: 104,
    info: "Name can't contain any of the following characters: ! @ # $ % ^ & * ( ) ` + - = [ ] { } ; ' : \" \\ | , . < > / ?",
  },
  {
    code: 105,
    info: "Name can't be a reserved name. Consult documentation for reserved names.", // TODO add link?
  },
  {
    code: 106,
    info: "Name cannot be empty!"
  },
  {
    code: 201,
    info: "Select a valid performative type!",
  },
  {
    code: 301,
    info: "Invalid value for a float"
  },
  {
    code: 401,
    info: "Invalid distribution name!"
  },
  {
    code: 402,
    info: "Invalid distribution arguments!"
  },
  {
    code: 501,
    info: "Too few enum values! At least two enum values are required!"
  },
  {
    code: 502,
    info: "The sum of percentages must be 100!"
  },
  {
    code: 503,
    info: "Invalid init value!"

  },
  {
    code: 901,
    info: "Unexpected error: Invalid param type! Contact the developers"
  }
];

export const validateGeneralNameRules = (name) => {
  if (hasWhiteSpace(name)) {
    return 102;
  } else if (!isNaN(parseFloat(name[0]))) {
    return 103;
  } else if (format.test(name)) {
    return 104;
  } else if (reserved_names.find((el) => el === name.toLowerCase()) !== undefined) {
    return 105;
  } else if (name.length === 0){
    return 106;
  }
  return 0;
}


export const validateAgentName = (name) => {
  const state = store.getState();
  const res = validateGeneralNameRules(name);
  if( res !== 0) return res;
  //check if agent with the same name exists
  else if(state.simulation.agent_types.find((el) => el.name === name) !== undefined){
    return 101;
  }
  return 0;
}

export const validateMessageName = (name, performative) => {
  const state = store.getState();
  const res = validateGeneralNameRules(name);
  if( res !== 0) return res;
  //check if agent with the same name exists
  else if (
    state.simulation.message_types.find(
      (el) => el.name === name && el.type === performative
    )
  ) {
    return 101;
  } else if (FIPACommActs.find((el) => el === performative) === undefined) {
    return 201;
  }
  return 0;
}

export const validateBehavName = (name) => {
  const state = store.getState();
  const res = validateGeneralNameRules(name);
  if( res !== 0) return res;
  else if (state.agentsTab.behaviours.find((el) => el.name === name)) {
    return 101;
  }
  return 0;
};

export const validateQualifiedName = (name) => {
  const state = store.getState();
  if (state.simulation.names.find((el) => el === name)) {
    console.log("namae wa duplicatedo");
    return false;
  }
  if (name === "") {
    console.log("namae wa emptey");
    return false;
  } else if (hasWhiteSpace(name)) {
    console.log("namawe wa blanku spaco");
    return false;
  } else if (!isNaN(parseFloat(name[0]))) {
    console.log("namae wa numero");
    return false;
  } else if (format.test(name)) {
    console.log("namae wa charactero specialo");
    return false;
  }
  return true;
};

function hasWhiteSpace(s) {
  const whitespaceChars = [" ", "\t", "\n"];
  return whitespaceChars.some((char) => s.includes(char));
}

export const distributionsDict = {
  normal: {
    name: "Normal",
    arg_count: 2,
    param_names: ["miu", "sigma"],
    validate: (args) => {
      if (args.length !== distributionsDict["normal"].arg_count) {
        return false;
      }
      if (args[1] <= 0) {
        //sigma > 0
        return false;
      }
      return true;
    },
  },
  exp: {
    name: "Exponential",
    arg_count: 1,
    param_names: ["lambda"],
    validate: (args) => {
      if (args.length !== distributionsDict["exp"].arg_count) {
        return false;
      }
      if (args[0] <= 0) {
        // lambda > 0
        return false;
      }
      return true;
    },
  },
};

export const validateFloatParam = (paramData) => {
  //validate param name
  const name = paramData.name;
  const state = store.getState();
  const res = validateGeneralNameRules(name);
  if( res !== 0) return res;
  else if (state.agentsTab.parameters.find((el) => el.name === name)) {
    return 101;
  }
  switch(paramData.type){
    case "initVal":
      if(isNaN(parseFloat(paramData.initVal))){
        return 301;
      }
      break;
    case "distribution":
      console.log(typeof(paramData.distribution))
      console.log(paramData.distribution)
      if(distributionsDict[paramData.distribution] === undefined){
        return 401;
      }else{
        const dist = distributionsDict[paramData.distribution];
        if(!dist.validate(paramData.distribution_args)){
          return 402;
        }
      }
      break;
    default:
      return 901;
  }
  return 0;
}

export const validateEnumParam = (paramData) => {
  const name = paramData.name;
  const state = store.getState();
  const res = validateGeneralNameRules(name);
  if( res !== 0) return res;
  else if (state.agentsTab.parameters.find((el) => el.name === name)) {
    return 101;
  }
  switch(paramData.type){
    case "new":
      const values = paramData.enumVals;
      if(values.length < 2){
        return 501;
      }
      switch(paramData.state){
        case "init":
          //valid if and only if there exists 1 ev with percentage 100%
          if(values.filter(el => parseFloat(el.percentage) === 100).length !== 1){
            return 503;
          }
          break;
        case "percentages":
          let sum = 0;
          for(let i=0; i<values.length; i++){
            sum += parseFloat(values[i].percentage);
          }
          if(sum !== 100){
            return 502;
          }
          break;
        default:
          return 901;

      }
      break;
    case "existing":
      return 0; // existing enum has been already validated
    default:
      return 901;
  }
  return 0;
}

export const validateListParam = (paramData) => {
  const name = paramData.name;
  const state = store.getState();
  const res = validateGeneralNameRules(name);
  if( res !== 0) return res;
  else if (state.agentsTab.parameters.find((el) => el.name === name)) {
    return 101;
  }
  return 0;

}