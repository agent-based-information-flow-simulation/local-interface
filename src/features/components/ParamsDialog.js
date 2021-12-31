import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Container } from "@mui/material";
import {distributionsDict} from "../../app/utils"
import FloatParam from "./FloatParam";
import EnumParam from "./EnumParam";
import ListParam from "./ListParam";
import {useDispatch} from "react-redux"
import {addEnum} from "./enumSlice";


function ParamsDialog(props) {
  const dispatch = useDispatch()
  const { onClose, open, type, addParam} = props;


  const handleClose = (event, reason) => {
    onClose(false);
  };

  const createParam = (paramData) => {
    let param = {};
    param.name = paramData.name;
    if(param.name === "" && paramData.type !== "existing") return null;
    switch(paramData.type){
      case "initVal":
        param.type = "float"; //old: float_init
        param.mode = "init"
        let val = parseFloat(paramData.initVal);
        if(isNaN(val)){
          return null;
        }
        param.value = paramData.initVal;
        return param;
      case "distribution":
        param.type = "float"
        param.mode = "distribution" //old: float_distribution
        param.distribution = paramData.distribution;
        for(let i=0; i<distributionsDict[param.distribution].arg_count; i++){
          if(isNaN(parseFloat(paramData.distribution_args[i]))){
            return null;
          }
        }
        param.distribution_args = paramData.distribution_args;
        return param;
      case "new":
        param.state = paramData.state;
        switch(paramData.state){
          case "init":
            param.type = "enum"; //old: enum_new_init
            param.mode = "new_init";
            param.values = paramData.enumVals;
            let val = parseFloat(paramData.selectedInit);
            if(param.values.length < 2){
              return null;
            }
            if(val < 0 || val >= param.values.length){
              return null;
            }
            param.selectedInit = paramData.selectedInit;
            return param;
          case "percentages":
            param.type = "enum"; //old: enum_new_percentages
            param.mode = "new_percentages";
            param.values = paramData.enumVals;
            let sum = 0;
            for(let i=0; i<param.values.length; i++){
              sum += parseFloat(param.values[i].percentage);
            }
            if(sum !== 100){
              return null;
            }
            return param;
          default:
            return null;
        }
      case "existing":
        param.name = paramData.oldEnumData.name;
        switch(paramData.oldEnumData.state){
          case "init":
            param.type = "enum"; //old: enum_existing_init
            param.mode = "existing_init";
            param.values = paramData.oldEnumData.values;
            param.selectedInit = paramData.oldEnumData.selectedInit;
            return param;
          case "percentages":
            param.type = "enum" //old: enum_existing_percentages
            param.mode = "exiting_percentages";
            param.values = paramData.oldEnumData.values;
            return param;
          default: return null;
        }
      case "conns":
        param.type = "list"
        param.mode = "conn"
        return param;
      case "msgs":
        param.type = "list"
        param.mode = "msg"
        return param;
      default:
        return null;
    }
  }

  const save = (paramData) => {
    let paramCandidate = createParam(paramData);
    if(paramCandidate == null){
      onClose(true)

    }else{
      dispatch(addParam(paramCandidate))
      if(paramData.type === "new"){
        dispatch(addEnum(paramCandidate))
      }

      onClose(false)
    }
  }

  const ModeDisplay = () => {
    switch (type) {
      case "float":
        return <FloatParam save={save}/>;
      case "enum":
        return <EnumParam save={save}/>;
      case "list":
        return <ListParam save={save}/>;
      default:
        return <></>;
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Container sx={{ padding: 3 }}>
        <DialogTitle> New parameter </DialogTitle>
        <ModeDisplay />
      </Container>
    </Dialog>
  );
}

ParamsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  addParam: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default ParamsDialog;
