import React from "react";
import { useController } from "react-hook-form";
import { TextField } from "@mui/material";

const AppInput = ({ name, ...props }) => {
  const { field, fieldState } = useController({ name, defaultValue: "" });
  const { error } = fieldState;

  const { required, ...rest } = props;

  const config = {
    id: `text_input_${name}`,
    key: `text_input_key-${name}`,
    type: props.type,
    ...field,
    ...rest,
  };

  return (
    <>
      <TextField
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#eee",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiInputLabel-root": {
            color: "white !important",
          },
          "& .MuiFormHelperText-root": { // Add this section for helper text color
            color: "#060004  !important",
          },
        }}
        {...config}
        error={error ? true : false}
        helperText={error ? error.message : ""}
      />
    </>
  );
};

export default AppInput;
