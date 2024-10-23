// FormComponents.js
import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export const FormField = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  ...props
}) => (
  <TextField
    name={name}
    label={label}
    value={value}
    onChange={onChange}
    type={type}
    variant="outlined"
    fullWidth
    margin="dense"
    {...props}
  />
);

export const SelectField = ({
  name,
  label,
  value,
  onChange,
  options,
  ...props
}) => (
  <FormControl fullWidth margin="dense" {...props}>
    <InputLabel>{label}</InputLabel>
    <Select name={name} value={value} onChange={onChange} variant="outlined">
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
