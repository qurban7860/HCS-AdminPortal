import React, { useMemo, useEffect, useState } from 'react'; 
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack, alpha, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

FilledTextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onSubmit: PropTypes.func,
  minRows: PropTypes.number,
};

function FilledTextField( { name, label, value, onSubmit, minRows } ) {
  const [isFocused, setIsFocused] = useState(false); 
  const theme = useTheme();
  
  const defaultValues = useMemo( () => ({
    [name]: value || "",
    }),[ value, name ]
  );

  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset, setError, formState: { isSubmitting, isDirty }} = methods;

  useEffect(() => {
    reset({ [name]: value || "" });
    setIsFocused(false);
  }, [value, name, reset]);

  const handleFormSubmit = handleSubmit( async (data) => {
    try{
      await onSubmit( name, data[name] );
      setIsFocused(false);
      } catch( error ){
      console.error(error);

      if (Array.isArray(error?.errors) && error?.errors?.length > 0) {
        const fieldError = error?.errors?.find((e) => e?.field === name);

        if (fieldError) {
          setError(name, {
            type: "manual",
            message: fieldError.message,
          });
        }
      }
    }
  });

  const handleReset = () => {
    reset();
    setIsFocused(false);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }} >
      <FormProvider methods={methods} onSubmit={handleFormSubmit} sx={{ width: '100%' }}>
        <RHFTextField
          name={name}
          label={label}
          multiline={name !== "summary"}
          minRows={ minRows || 1 }
          variant="filled"
          fullWidth
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            "& .MuiInputBase-root": {
              padding: "8px",
              boxSizing: "border-box",
              backgroundColor: isFocused ? 'transparent' : alpha(theme.palette.grey[500], 0.08),
              border: isFocused ? `1px solid ${theme.palette.common.black}` : '1px solid transparent',
              transition: 'border 0.3s ease-in-out, background-color 0.3s ease-in-out',

              '&:hover': {
                backgroundColor: isFocused ? 'transparent !important' : `${alpha(theme.palette.grey[500], 0.08)} !important`,
                border: isFocused ? `1px solid ${theme.palette.common.black}` : '1px solid transparent !important',
              },
            },
            "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before, & .MuiInput-underline.Mui-focused:before": {
              borderBottom: "none",
            },
            '& .Mui-focused .MuiInputBase-root': {
              backgroundColor: 'transparent !important',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.common.black}`, 
              transition: "border 0.3s ease-in-out",
              outline: 'none',
            },
            '& .MuiInputBase-input': {
              padding: '0',
              margin: '0',
              fontWeight: isFocused ? 'bold' : 'normal',
              fontSize: isFocused ? '1.2rem' : 'inherit',
              transition: 'font-weight 0.2s, font-size 0.2s',
            },
          }}
        />
        {(isFocused || isDirty) && ( 
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
              onClick={ handleReset }
              sx={{minWidth: 32, padding: '2px', height: 32}}
            >
              <ClearRoundedIcon/>
            </Button>
          </Stack>
        )}
      </FormProvider>
    </Box>
  )
}

export default FilledTextField