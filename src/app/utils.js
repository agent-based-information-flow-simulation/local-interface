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

export const errorCodes = [
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
    info: "Name can't contain any of the following characters: ! @ # $ % ^ & * ( ) + - = [ ] { } ; ' : \" \\ | , . < > / ?",
  },
  {
    code: 105,
    info: "Name can't be a reserved name. Consult documentation for reserved names.", // TODO add link?
  },
  {
    code: 201,
    info: "Select a valid performative type!",
  },
];

export const validateAgentName = (name) => {
  const state = store.getState();
  const format = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]+/;
  //check if agent with the same name exists
  if (state.simulation.agent_types.find((el) => el.name === name)) {
    return 101;
  } else if (hasWhiteSpace(name)) {
    return 102;
  } else if (!isNaN(parseFloat(name[0]))) {
    return 103;
  } else if (format.test(name)) {
    return 104;
  } else if (reserved_names.find((el) => el === name.toLowerCase()) !== undefined) {
    return 105;
  }
  return 0;
};

export const validateMessageName = (name, performative) => {
  const state = store.getState();
  const format = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]+/;
  //check if agent with the same name exists
  if (
    state.simulation.message_types.find(
      (el) => el.name === name && el.type === performative
    )
  ) {
    return 101;
  } else if (hasWhiteSpace(name)) {
    return 102;
  } else if (!isNaN(parseFloat(name[0]))) {
    return 103;
  } else if (format.test(name)) {
    return 104;
  } else if (FIPACommActs.find((el) => el === performative) === undefined) {
    return 201;
  } else if (reserved_names.find((el) => el === name.toLowerCase()) !== undefined) {
    return 105;
  }
  return 0;
};

export const validateBehavName = (name) => {
  const state = store.getState();
  const format = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]+/;
  if (state.agentsTab.behaviours.find((el) => el.name === name)) {
    return 101;
  } else if (hasWhiteSpace(name)) {
    return 102;
  } else if (!isNaN(parseFloat(name[0]))) {
    return 103;
  } else if (format.test(name)) {
    return 104;
  } else if (reserved_names.find((el) => el === name.toLowerCase()) !== undefined) {
    return 105;
  }
  return 0;
};

export const validateQualifiedName = (name) => {
  const state = store.getState();
  if (state.simulation.names.find((el) => el === name)) {
    console.log("namae wa duplicatedo");
    return false;
  }
  const format = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]+/;
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
