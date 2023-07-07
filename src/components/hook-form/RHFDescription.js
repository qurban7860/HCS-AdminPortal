import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFDescription.propTypes = {
  name: PropTypes.string,
  schema: PropTypes.object,
  helperText: PropTypes.node,
};

export default function RHFDescription({ name,schema, helperText, ...other }) {
  const { control, formState: { errors }, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate: schema, }}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          error={!!errors[name]}
          helperText={errors[name] ? errors[name]?.message : helperText}
          onChange={(e) => {
            setValue(name, e.target.value); // Update the form value
            field.onChange(e); // Trigger the field's onChange event
          }}
          onBlur={(e) => {
            field.onBlur(e); // Trigger the field's onBlur event
          }}
          {...other}
        />
      )}
    />
  );
}
