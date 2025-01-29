import React from 'react'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FormProvider, { RHFTextField } from '../../../components/hook-form';


function FilledTextField( name, label, value, onSubmit ) {

      const methods = useForm({
        resolver: yupResolver(AddTicketSchema),
        value,
      });

      const { handleSubmit, reset, formState: { isSubmitting, isDirty }} = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
    <Box sx={{ position: "relative", width: "100%" }} >
        <RHFTextField
            name={name} 
            label={label}
            value={value}
            multiline
            variant="filled"
            fullWidth
            sx={{ 
                "& .MuiInputBase-root": {
                  padding: "8px", 
                },
                "& .MuiInput-underline:before": {
                  borderBottom: "none", 
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none", 
                },
                "& .MuiInput-underline.Mui-focused:before": {
                  borderBottom: "none", 
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
    </Box>
    </FormProvider>
  )
}

export default FilledTextField