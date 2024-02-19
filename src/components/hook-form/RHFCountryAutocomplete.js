import { useEffect } from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField, Box } from '@mui/material';
import { countries } from '../../assets/data/countries';

// ----------------------------------------------------------------------

RHFCountryAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFCountryAutocomplete({ name, label, helperText, Error, ...other }) {
  const { control, setValue } = useFormContext();

  useEffect(()=>{
    setValue(name,countries?.find(country => country?.code?.toLocaleLowerCase() === 'nz'))
  },[ name,setValue ])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          options={ countries || [] }
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          getOptionLabel={(option) => `${option?.label || '' } (${option.code || '' })  ${option.phone}`}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label} ({option.code}) {option.phone}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error || !!Error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
