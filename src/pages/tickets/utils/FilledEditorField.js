import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Stack } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { ticketSchema } from '../../schemas/ticketSchema';
import FormProvider, { RHFEditor } from '../../../components/hook-form';

FilledEditorField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onSubmit: PropTypes.func,
  minRows: PropTypes.number,
  isEditor: PropTypes.bool,
};

function FilledEditorField({ name, label, value, onSubmit, minRows, isEditor = true }) {

  const defaultValues = useMemo(
    () => ({
      [name]: value || "",
    }), [value, name]);

  const methods = useForm({
    // resolver: yupResolver( ticketSchema ),
    defaultValues,
  });
  const { handleSubmit, reset, setError, formState: { isSubmitting, isDirty } } = methods;

  useEffect(() => {
    reset({ [name]: value || "" });
  }, [value, name, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(name, data[name]);

    } catch (error) {
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

  return (
    <Box sx={{ position: "relative", width: "100%" }} >
      <FormProvider methods={methods} onSubmit={handleFormSubmit} sx={{ width: "100%" }} >
        <RHFEditor
          name={name}
          label={label}
          multiline={name !== "summary"}
          minRows={minRows || 1}
          fullWidth
          readOnly={!isEditor}
          hideToolbar={!isEditor}
        />
        {isDirty && isEditor && <Stack
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
            disabled={isSubmitting}
            loading={isSubmitting}
            sx={{ minWidth: 32, padding: '2px', height: 32 }}
          >
            <CheckRoundedIcon />
          </LoadingButton>
          <Button
            variant="outlined"
            size="small"
            onClick={() => reset()}
            sx={{ minWidth: 32, padding: '2px', height: 32 }}
          >
            <ClearRoundedIcon />
          </Button>
        </Stack>}
      </FormProvider>
    </Box>
  )
}

export default FilledEditorField