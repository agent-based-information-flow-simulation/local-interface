import React, { useState } from "react";
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { Container, Button } from "@mui/material";

import FloatParam, {distributionsDict} from "./components/FloatParam";
import EnumParam from "./components/EnumParam";
import ListParam from "./components/ListParam";
import {useDispatch} from "react-redux"

import {
  selectParamData,
  addParam
} from "./agentsTabSlice"

function ParamsDialog(props) {
  const dispatch = useDispatch()
  const paramData = useSelector(selectParamData)
  const { onClose, open, type } = props;

  const [paramName, setParamName] = useState();

  const handleClose = () => {
    onClose(false);
  };

  const createParam = () => {
    let param = {};
    param.name = paramName;
    switch(paramData.type){
      case "initVal":
        param.type = "float_init";
        let val = parseFloat(paramData.initVal);
        if(isNaN(val)){
          return null;
        }
        param.value = paramData.initVal;
        return param;
      case "distribution":
        param.type = "float_distribution"
        param.distribution = paramData.distribution;
        for(let i=0; i<distributionsDict[param.distribution].arg_count; i++){
          if(isNaN(parseFloat(paramData.distribution_args[i]))){
            return null;
          }
        }
        param.distribution_args = paramData.distribution_args;
        return param;
      case "new":
        switch(paramData.state){
          case "init":
            param.type = "enum_new_init"
            param.values = paramData.enumVals;
            let val = parseFloat(paramData.selectedInit);
            if(val < 0 || val >= param.values.length){
              return null;
            }
            param.selectedInit = paramData.selectedInit;
            return param;
          case "percentages":
            param.type = "enum_new_percentages"
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
        //none exist yet, lmaoo
        break;
      case "conns":
        param.type = "list_conns"
        return param;
      case "msgs":
        param.type = "list_msgs"
        return param;
      default:
        return null;
    }
  }

  const save = () => {
    console.log("CLIECKED:")
    let paramCandidate = createParam();
    console.log(paramCandidate)
    if(paramCandidate == null){
      onClose(true)

    }else{
      dispatch(addParam(paramCandidate))
      onClose(false)
    }
  }

  const ModeDisplay = () => {
    switch (type) {
      case "float":
        return <FloatParam />;
      case "enum":
        return <EnumParam />;
      case "list":
        return <ListParam />;
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
        <TextField
          variant="outlined"
          label="Name"
          id="param_name"
          value={paramName}
          onChange={(e) => setParamName(e.target.value)}
        />
        <ModeDisplay />
        <Button onClick={save}> Add parameter </Button>
      </Container>
    </Dialog>
  );
}

ParamsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default ParamsDialog;
