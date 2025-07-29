import PropTypes from 'prop-types';
import { TextField, InputAdornment, Button } from '@mui/material';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../iconify';


function TextSearchField({
  onChange,
  onClick,
  isFiltered,
  value,
}) {

  return (
    <>
        {onChange &&<TextField
          fullWidth
          value={value}
          onChange={onChange}
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (isFiltered && (
              <InputAdornment position="end">
                <Button fullWidth onClick={onClick} color='error' size='small' startIcon={<Iconify icon='eva:trash-2-outline' />}>
                  {BUTTONS.CLEAR}
                </Button>
              </InputAdornment>
            )
            ),
          }}
        />}
    </>
  );
}

TextSearchField.propTypes = {
  isFiltered: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default TextSearchField;
