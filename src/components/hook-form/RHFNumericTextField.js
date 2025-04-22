import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFNumericField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
  allowDecimals: PropTypes.bool,
  decimalPlaces: PropTypes.number,
  allowNegative: PropTypes.bool,
  inputProps: PropTypes.object,
};

export default function RHFNumericField({
  name,
  helperText,
  Error,
  allowDecimals = true,
  decimalPlaces = 2,
  allowNegative = false,
  inputProps = {},
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '0' : field.value || ''}
          error={!!error || !!Error}
          helperText={error ? error?.message : helperText}
          inputProps={{
            inputMode: 'decimal',
            pattern: (() => {
              if (allowDecimals) {
                return allowNegative
                  ? `^-?\\d*(\\.\\d{0,${decimalPlaces}})?$`
                  : `^\\d*(\\.\\d{0,${decimalPlaces}})?$`;
              }
              return allowNegative ? '^-?\\d*$' : '^\\d*$';
            })(),
            onInput: (e) => {
              const { value } = e.target;

              // Create regex pattern based on props
              let regex;
              if (allowDecimals) {
                // Allow decimals with specified decimal places
                const decimalPattern = `(\\.[0-9]{0,${decimalPlaces}})?`;
                regex = allowNegative
                  ? new RegExp(`^-?[0-9]*${decimalPattern}$`)
                  : new RegExp(`^[0-9]*${decimalPattern}$`);
              } else {
                // Integer only
                regex = allowNegative ? /^-?[0-9]*$/ : /^[0-9]*$/;
              }

              // If input doesn't match pattern, revert to previous valid value
              if (value !== '' && !regex.test(value)) {
                e.target.value = field.value || '';
              }
            },
            ...inputProps,
          }}
          {...other}
        />
      )}
    />
  );
}
