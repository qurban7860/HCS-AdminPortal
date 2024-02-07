import { MuiTelInput } from 'mui-tel-input';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';

RHFPhoneInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  flagSize: PropTypes.string,
  defaultCountry: PropTypes.string,
  onChange: PropTypes.func,
  inputProps: PropTypes.object,
};

export default function RHFPhoneInput({ name, label, flagSize, defaultCountry, onChange, inputProps, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTelInput
          value={field.value}
          name={name}
          label={label}
          flagSize={flagSize || 'medium' }
          defaultCountry={ defaultCountry || "NZ" }
          onChange={(newValue) => setValue(name, newValue, { shouldValidate: true })}
          inputProps={{ ...inputProps, maxLength: 13 }}
          forceCallingCode
          fullWidth
          error={!!error}
          helperText={error ? error.message : ''}
          {...other}
        />
      )}
    />
  );
}
