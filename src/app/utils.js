import {store} from "./store"

export const validateQualifiedName = (name) => {
  const state = store.getState();
  if(state.simulation.names.find(el => el === name)){
    console.log("namae wa duplicatedo")
    return false;
  }
  const format = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]+/;
  if(name === ""){
    console.log("namae wa emptey")
    return false;
  }else if(hasWhiteSpace(name)){
    console.log("namawe wa blanku spaco")
    return false;
  }
  else if(!isNaN(parseFloat(name[0]))){
    console.log("namae wa numero")
    return false;
  }else if(format.test(name)){
    console.log("namae wa charactero specialo")
    return false;
  }
  return true;
}

function hasWhiteSpace(s) {
  const whitespaceChars = [' ', '\t', '\n'];
  return whitespaceChars.some(char => s.includes(char));
}

export const distributionsDict = {
  normal: {
    name: "Normal",
    arg_count: 2,
    param_names: ["miu", "sigma"],
    validate: (args) => {
      if(args.length !== distributionsDict["normal"].arg_count){
        return false
      }
      if(args[1] <= 0){ //sigma > 0
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
      if(args.length !== distributionsDict["exp"].arg_count){
        return false
      }
      if(args[0] <= 0){ // lambda > 0
        return false;
      }
      return true;
    },
  },
};
