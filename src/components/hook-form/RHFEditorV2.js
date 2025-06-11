import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
import { Editor } from '../editorTipTap';

// ----------------------------------------------------------------------

RHFEditorV2.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFEditorV2({ name, helperText, ...other }) {
  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          {...field}
          id={name}
          error={!!error}
          resetValue={isSubmitSuccessful}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />)
      }
    />
  );
}
