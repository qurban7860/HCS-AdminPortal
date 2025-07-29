import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FormProvider, { RHFDatePicker } from '../../../components/hook-form';

FilledTextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onSubmit: PropTypes.func,
  minRows: PropTypes.number,
  isLoading: PropTypes.bool,
};

function FilledTextField( { name, label, value, isLoading, onSubmit, minRows } ) {

      const defaultValues = useMemo(
        () => ({
          [name]: value || "",
        }),[ value, name ]);

      const methods = useForm({
        // resolver: yupResolver( ticketSchema ),
        defaultValues,
      });
      const { handleSubmit, reset, formState: { isSubmitting, isDirty }} = methods;

      useEffect(() => {
        reset({ [name]: value || "" }, { keepDirty: false });
      }, [value, name, reset]);
      
      const handleFormSubmit = handleSubmit( async (data) => {
        try{
          await onSubmit( name, data[name] );
          await reset({ [name]: data[name] }, { keepDirty: false });
        } catch( error ){
          console.error(error);
        }
      });
  return (
    <Box sx={{ position: "relative", width: "100%" }} >
      <FormProvider methods={methods} onSubmit={handleFormSubmit} sx={{ width: "100%" }} >
        <RHFDatePicker
            name={name} 
            label={label}
            variant="filled"
            fullWidth
            sx={{ 
              "& .MuiInputBase-root": {
                padding: "8px",
                boxSizing: "border-box",
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
        { isDirty && <Stack 
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
  )
}

export default FilledTextField