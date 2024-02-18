import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { MuiChipsInput } from 'mui-chips-input'

RHFChipsInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default function RHFChipsInput({ name, label, value, onChange, ...other }) {

  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value || []}
      render={({ field, fieldState: { error } }) => (
        <MuiChipsInput
          name={field.name}
          label={label}
          value={field.value}
          onChange={(chips) => {
            field.onChange([...new Set(chips)]);
            if (onChange) { onChange([...new Set(chips)]) }
          }}
          error={!!error }
          helperText={error && error?.message }
          {...other}
        />
      )}
    />
  );
}
