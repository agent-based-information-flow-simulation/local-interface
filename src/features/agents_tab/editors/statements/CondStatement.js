import React, { useState } from "react";

export const CondStatement = () => {
  const addCondStatement = () => {
    let err_flag = false;
    if (
      variables.findIndex((el) => el === curLhs) === -1 &&
      isNaN(parseFloat(curLhs))
    ) {
      setLhsError(true);
      err_flag = true;
    }
    if (
      variables.findIndex((el) => el === curRhs) === -1 &&
      isNaN(parseFloat(curRhs))
    ) {
      setRhsError(true);
      err_flag = true;
    }
    if (!err_flag) {
      let statement =
        "If " +
        curLhs +
        " " +
        FloatCondOps.find((el) => el.opcode === curOpCode).label +
        " " +
        curRhs;
      let operation = curOpCode + "    " + curLhs + "," + curRhs;
      save(statement, operation);
      setEditOn(false);
      setLhsError(false);
      setRhsError(false);
    }
  };

  return (
    <Stack direction="row">
      <Autocomplete
        freeSolo
        options={variables}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: "200px" }}
        error={lhsError}
        value={curLhs}
        inputValue={curLhs}
        onInputChange={(event, value) => handleLhsChange(value)}
        helperText="LHS must be a valid variable or a number"
      />
      <Select value={curOpCode} onChange={(e) => setCurOpCode(e.target.value)}>
        {FloatCondOps.map((op, index) => {
          return <MenuItem value={op.opcode}> {op.label} </MenuItem>;
        })}
      </Select>
      <Autocomplete
        freeSolo
        options={variables}
        renderInput={(params) => <TextField {...params} />}
        sx={{ width: "200px" }}
        error={rhsError}
        value={curRhs}
        inputValue={curRhs}
        onInputChange={(event, value) => handleRhsChange(value)}
        helperText="RHS must be a valid variable or a number"
      />
      <IconButton sx={{ p: "10px" }} color="primary" onClick={addCondStatement}>
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
};

export default CondStatement;
