import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

RHFName.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFName({ name, helperText, ...other }) {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange } = field;
        const error = errors[name]; // Get the error for the specific field name

        const handleChange = (event) => {
          const inputValue = event.target.value;

          if (inputValue.length <= 40) {
            onChange(inputValue);
          } else {
            onChange(inputValue.slice(0, 40)); // Trim the value to 40 characters
          }
        };

        return (
          <TextField
            {...field}
            fullWidth
            value={value}
            onChange={handleChange}
            error={!!error}
            helperText={error && error.message ? error.message : helperText}
            inputProps={{
              maxLength: 40, // Set the maximum length of the input
            }}
            {...other}
          />
        );
      }}
    />
  );
}