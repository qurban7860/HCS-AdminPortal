import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { ToggleButton, ToggleButtonGroup, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

RHFToggleButton.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired, // Array of options for the ToggleButtonGroup
  label: PropTypes.string,
  helperText: PropTypes.node,
  exclusive: PropTypes.bool, // Exclusive toggle behavior
  error: PropTypes.bool,
};

export default function RHFToggleButton({
  name,
  options,
  label,
  helperText,
  exclusive = true,
  error,
  ...other
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {label && <div style={{ marginBottom: 8 }}>{label}</div>}
          <ToggleButtonGroup
            color="primary"
            value={field.value}
            exclusive={exclusive}
            onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
            {...other}
          >
            {options?.map((option) => (
              <ToggleButton key={ option } value={ option } >
                { option }
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {(!!fieldError || helperText) && (
            <FormHelperText error={!!fieldError}>
              {fieldError ? fieldError.message : helperText}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
