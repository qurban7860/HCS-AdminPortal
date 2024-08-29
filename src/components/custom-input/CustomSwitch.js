// @mui
import { styled } from '@mui/material/styles';
import { FormControlLabel, Switch, Typography, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

const CustomSwitch = styled((props) => {
  const { checked, label, onChange } = props;

  return (
    <div style={{ display: 'flex' }}>
      <FormControlLabel
        control={<Switch checked={ checked } onChange={ onChange } />}
        label={
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
          >
            {label}
          </Typography>
        }
      />
    </div>
  );
})(({ theme }) => ({}));

export default CustomSwitch;
