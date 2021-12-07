export const validateQualifiedName = (name) => {
  const format = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
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