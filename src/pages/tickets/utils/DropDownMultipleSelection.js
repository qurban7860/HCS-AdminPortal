import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack, TextField, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';
import Iconify from '../../../components/iconify';

  DropDownMultipleSelection.propTypes = {
  value: PropTypes.array, 
  name: PropTypes.string, 
  label: PropTypes.string, 
  options: PropTypes.array, 
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  multiple: PropTypes.bool,
  isStatus: PropTypes.bool,
};

export default function DropDownMultipleSelection( { value, name, label, options = [], isLoading, onSubmit, multiple = true, isStatus } ) {

  const defaultValues = useMemo(() => {
    const initialValue = multiple ? [] : null; 
    return {
      [name]: value || initialValue,
    };
  }, [value, name, multiple]);
  
  const methods = useForm({
    // resolver: yupResolver( ticketSchema ),
    defaultValues,
  });
        
  const { handleSubmit, watch, setValue, reset, formState: { isSubmitting }} = methods;

  useEffect(() => {
    const initialValue = multiple ? [] : null;
    reset({ [name]: value || initialValue });
  }, [value, name, reset, multiple]);

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

  const handleOnChange = (event, newValue) => {
    setValue(name, newValue);
    if (!multiple) {
      onSubmit(name, newValue);
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }} >
      <FormProvider methods={methods} onSubmit={ handleSubmit( handleOnSubmit )} sx={{ width: "100%" }} >
      <RHFAutocomplete
        multiple={multiple}
        id="size-small-standard"
        name={name}
        disableCloseOnSelect={multiple}
        limitTags={3}
        size="small"
        options={options}
        isOptionEqualToValue={(option, v ) => option?._id === v?._id }
        // getOptionLabel={(option) => `${option?.firstName || "" } ${option?.lastName || ""}`}
        getOptionLabel={(option) =>
          isStatus ? option?.name || `${option?.firstName || ""} ${option?.lastName || ""}`
          : `${option?.firstName || ""} ${option?.lastName || ""}`
        }
        onChange={handleOnChange}
        renderOption={(props, option) => (
          <li {...props} key={option?._id}>
              <Box display="flex" alignItems="center">
                {isStatus ? (
                  <>
                    <Iconify icon={option.icon} color={option?.color || "inherit"} size="20px" sx={{ mr: 1 }} />
                    { option?.name ? option?.name : `${option?.firstName || "" } ${option?.lastName || ""}` || ""}
                  </>
                ) : (
                  <>
                    <CustomAvatar
                      name={`${option?.firstName || "" } ${option?.lastName || ""}`}
                      alt={ option?.firstName || "" }
                      sx={{ m: 0.3, mr: 1, width: '30px', height: '30px' }}
                    />
                    {`${option?.firstName || ""} ${option?.lastName || ""} (${option?.email || "No Email"})`}
                  </>
                )}
              </Box>
          </li>
        )}
        renderInput={(params) => (
            <TextField  
              {...params}
              variant='filled'
              // InputProps={{
              //   ...params.InputProps,
              //   startAdornment: !multiple && val && isStatus ? (
              //     <InputAdornment position="start">
              //       <Iconify icon={val.icon} color={val?.color || "inherit"} size="20px" sx={{ mb: 2.5, mr: -1 }} />
              //     </InputAdornment>
              //   ) : null,
              // }}
              sx={{
                "& .MuiInputBase-root": {
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  ...(multiple ? {} : {minHeight: "40px"}),
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
                  marginBottom: "5px", 
                  ...(multiple? {} : {padding: "8px 0"}),
                },
                "& .MuiChip-root": {
                  height: 28,
                  fontSize: '0.8125rem',
                  padding: '0 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 1,
                },
                "& .MuiChip-label": {
                  padding: '0 8px',
                },
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
