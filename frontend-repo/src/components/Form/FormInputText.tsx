import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

export type FormInputProps = {
  name: string;
  control: any;
  label: string;
  type?: string;
};
export const FormInputText = ({ name, control, label, type }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => {
        console.log(error);
        return (
          <TextField
            type={type || "text"}
            helperText={error ? error.message : null}
            size="small"
            error={!!error}
            onChange={onChange}
            value={value}
            fullWidth
            label={label}
            variant="outlined"
          />
        );
      }}
    />
  );
};
