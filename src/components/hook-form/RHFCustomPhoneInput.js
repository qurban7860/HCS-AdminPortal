import { TextField, InputAdornment, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import Iconify from '../iconify';



RHFCustomPhoneInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  index: PropTypes.number,
  value: PropTypes.object,
};


export default function RHFCustomPhoneInput({ name, value, index, label, ...other }) {
  const { control, setValue } = useFormContext();
  const PHONE_TYPES_ = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'PHONE_TYPES' )
  let PHONE_TYPES = ['Mobile', 'Home', 'Work', 'Fax', 'Others'];
  if(PHONE_TYPES_) {
    PHONE_TYPES = PHONE_TYPES_.value.split(',').map(item => item.trim());
  }
  
    

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField 
          {...field}
          label={label}
          fullWidth
          placeholder='Number'
          value={ value?.contactNumber?.replace(/[^0-9]/g) || '' }
          onChange={(e) => {
              const inputValue = e.target.value.replace(/[^0-9]/g, '');
              setValue( name, { ...value, contactNumber: inputValue}   , { shouldValidate: true });
          }}
          InputProps={{
            startAdornment: (
              <>
              <InputAdornment position="start" >
              <Iconify icon="mdi:phone" sx={{ width: 25, height: 25, }} />
                <Autocomplete 
                  // freeSolo
                  disableClearable
                  size='small'
                  value={ value?.type || null }
                  sx={{width: '90px', mx:1 }} 
                  options={ PHONE_TYPES }
                  onChange={(event, newValue) => { setValue( name, { ...value, type: newValue } , { shouldValidate: true } ) }}
                  renderInput={(params) => ( <TextField {...params} variant="standard" size='small' placeholder='Type' sx={{mb:0.9}}/> )}
                />
              +
              <TextField  
                  value={ value?.countryCode || '' }
                  variant="standard" 
                  sx={{width: '90px', mx:1 }} 
                  InputProps={{
                    inputProps: {
                      maxLength: 6
                    },
                  }}
                  onChange={(e) => {
                      const inputValue = e.target.value.replace(/[^0-9]/g, '')
                        setValue( name, { ...value , countryCode: inputValue } , { shouldValidate: true });
                  }} 
                  placeholder='Country Code'
              />
              |
              </InputAdornment>
              </>
            ),
            endAdornment: (
              <InputAdornment position="start" >
                <TextField  
                    value={ value?.extensions || '' }
                    variant="standard" 
                    placeholder='Ext.'
                    sx={{width: '80px', mx:1 }} 
                    InputProps={{
                      inputProps: {
                        maxLength: 10
                      },
                    }}
                    onChange={(e) => {
                        const inputValue = e.target.value.replace(/[^0-9]/g, '')
                          setValue(name,{ ...value, extensions: inputValue } , { shouldValidate: true });
                    }} 
                />
              </InputAdornment>
            ),
            inputProps: {
                      maxLength: 16
                    },
          }}
          {...other}
        />
      )}
    />
  );
}
