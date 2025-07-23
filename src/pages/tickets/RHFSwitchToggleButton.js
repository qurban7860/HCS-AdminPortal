import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
} from '@mui/material';

RHFSwitchToggleButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFSwitchToggleButton({
  name,
  label,
  helperText,
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          error={!!error}
          sx={{ minHeight: 43, my: 0, ml: 1, pt: 1 }}
        >
          <ToggleButtonGroup
            value={field.value === true ? 'closed' : 'open' }
            exclusive
            onChange={(_, newValue) => {
              field.onChange(newValue === 'closed');
            }}
            size="small"
            sx={{
              height: 43,
              '& .MuiToggleButton-root': {
                borderRadius: 1,
                textTransform: 'capitalize',
                px: 2,
                '&.Mui-selected': {
                  color: 'white',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="open">Open</ToggleButton>
            <ToggleButton value="closed">Resolved</ToggleButton>
          </ToggleButtonGroup>

          {(!!error || helperText) && (
            <FormHelperText>
              {error ? error.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
