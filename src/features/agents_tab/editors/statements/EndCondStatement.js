import React, { useState } from "react";

export const EndCondStatement = () => {
  const addEndCondStatement = () => {
    let statement = "End if";
    let operation = "FI";
    save(statement, operation);
  };

  return (
    <Stack direction="row">
      <InlineText text="End conditional block" />
      <IconButton
        sx={{ p: "10px" }}
        color="primary"
        onClick={addEndCondStatement}
      >
        <AddCircleIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
};

export default EndCondStatement;
