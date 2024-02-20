import { TextField, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import Iconify from '../iconify';

RHFCustomPhoneInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};


export default function RHFCustomPhoneInput({ name, label, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField 
          {...field}
          label={label}
          fullWidth
          value={ field?.value?.number }
          onChange={(e) => {
              const inputValue = e.target.value;
              if (/^\d*$/.test(inputValue)) {
                setValue(name, { ...field?.value, number: inputValue || '' }, { shouldValidate: true });
              }
          }} 
          onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                  return;
              }
              if (!/^\d*$/.test(e.key)) {
                  e.preventDefault();
              }
          }}
          InputProps={{
            startAdornment: (
              <>
              <Iconify icon="mdi:phone" sx={{ width: 35, height: 35, mr:1 }} />
              <InputAdornment position="start" >
              +
              <TextField  
                  value={field?.value?.countryCode || '' }
                  variant="standard" 
                  sx={{width: '60px', mr:1 }} 
                  InputProps={{
                    inputProps: {
                      inputMode: 'numeric', 
                      pattern: '[0-9]*',
                      maxLength: 6
                    },
                  }}
                  onChange={(e) => {
                      const inputValue = e.target.value;
                      if (/^\d*$/.test(inputValue)) {
                        setValue(name, { ...field?.value , countryCode: inputValue || '' } , { shouldValidate: true });
                      }
                  }} 
                  onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                          return;
                      }
                      if (!/^\d*$/.test(e.key)) {
                          e.preventDefault();
                      }
                  }}
              />
              |
              </InputAdornment>
              </>
            ),
            // sx: {
            //   "& .MuiInputBase-input": { 
            //     bord
            //     borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
            //     // marginTop: "-10px",
            //     width: 120,
            //   }
            // },
            inputProps: {
                      className: 'custom-input',
                      inputMode: 'numeric', 
                      pattern: '[0-9]*',
                      maxLength: 12
                    },
          }}
          placeholder='number'
          {...other}
        />
      )}
    />
  );
}
