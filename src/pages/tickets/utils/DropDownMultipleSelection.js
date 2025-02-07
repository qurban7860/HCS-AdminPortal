import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';

  DropDownMultipleSelection.propTypes = {
  value: PropTypes.object, 
  name: PropTypes.string, 
  label: PropTypes.string, 
  options: PropTypes.array, 
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function DropDownMultipleSelection( { value, name, label, options = [], isLoading, onSubmit } ) {

  const defaultValues = useMemo(
    () => ({
      [name]: value || "",
  }),[ value, name ]);
  
  const methods = useForm({
    // resolver: yupResolver( ticketSchema ),
    defaultValues,
  });
        
  const { handleSubmit, watch, reset, formState: { isSubmitting }} = methods;

  useEffect(() => {
    reset({ [name]: value || "" });
  }, [value, name, reset]);

  const val = watch( name )

  const handleOnSubmit = async ( data ) => {
    try{
      if( Array.isArray(data[name]) ){
        await onSubmit( name, data[name] );
      }
    } catch(e){
      console.log(e);
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }} >
      <FormProvider methods={methods} onSubmit={ handleSubmit( handleOnSubmit )} sx={{ width: "100%" }} >
      <RHFAutocomplete
        multiple
        id="size-small-standard"
        name={name}
        disableCloseOnSelect
        limitTags={3}
        size="small"
        options={options}
        isOptionEqualToValue={(option, v ) => option._id === v._id }
        getOptionLabel={(option) => `${option?.firstName || "" } ${option?.lastName || ""}`}
        renderOption={(props, option) => (
          <li {...props} key={option?._id}>
              <Box display="flex" alignItems="center">
                <CustomAvatar
                  name={`${option?.firstName || "" } ${option?.lastName || ""}`}
                  alt={ option?.firstName || "" }
                  sx={{ m: 0.3, mr: 1, width: '30px', height: '30px' }}
                />
                {`${option?.firstName || "" } ${option?.lastName || ""}`}
              </Box>
          </li>
        )}
        renderInput={(params) => ( 
          <TextField  
            {...params}
            variant='filled'
            sx={{
              "& .MuiInputBase-root": {
                padding: "8px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap"
              },
              "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before, & .MuiInput-underline.Mui-focused:before": {
                borderBottom: "none",
              },
              "&:hover .MuiInputBase-root, & .Mui-focused .MuiInputBase-root": {
                backgroundColor: "transparent !important",
                borderRadius: "8px",
                transition: "border 0.3s ease-in-out",
                outline: "1px solid",
              },
              "& .MuiInputBase-input": {
                padding: "0",
                margin: "0" 
              }
            }}
          /> 
        )}
      />
          { Array.isArray( val ) && 
            Array.isArray( value ) && 
            ( ( val?.length !== value?.length ) || !val?.every(v => value?.some(vc => vc?._id === v?._id)) ) && 
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{
                position: 'absolute',
                bottom: -53, 
                right: 0,   
                transform: 'translateY(-50%)',
              }}
            >
            <LoadingButton
                variant="contained"
                color="primary"
                size="small"
                type="submit"
                disabled={ isSubmitting }
                loading={isSubmitting}
                sx={{minWidth: 32, padding: '2px', height: 32}}
            >
                <CheckRoundedIcon/>
            </LoadingButton>
            <Button
                variant="outlined"
                size="small"
                onClick={() => reset()}
                sx={{minWidth: 32, padding: '2px', height: 32}}
            >
                <ClearRoundedIcon/>
            </Button>
        </Stack>}
      </FormProvider>
    </Box>
  );
}
