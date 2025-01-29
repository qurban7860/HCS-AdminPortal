import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Menu, MenuItem, Typography, } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Iconify from '../../../components/iconify';


DropDownField.propTypes = {
    value: PropTypes.object, 
    name: PropTypes.string, 
    list: PropTypes.array, 
    label: PropTypes.string, 
    onSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    isSubmitting: PropTypes.bool,
  };

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
  },
}));

export default function DropDownField( { value, name, list, isLoading, label, onSubmit, isSubmitting,  } ) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div >
      <Button
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        color={ value.color }
        startIcon={ <Iconify icon={ value.color } /> }
        endIcon={
          ( isSubmitting ? 
          <Iconify icon="eos-icons:loading" /> :
            ( Array.isArray( list ) && 
            list?.length > 0 && 
            <KeyboardArrowDownIcon /> )
          )
        }
        disabled={ isSubmitting }
      >
        { value?.name || "" }
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        { isLoading && (  
          <MenuItem> 
            <Iconify icon="eos-icons:loading" size="40px" sx={{ ml:1 }}/> Loading... 
          </MenuItem>
        )}
        { !isLoading && Array.isArray( list ) && 
          list?.map( ( p ) => 
            <MenuItem 
              key={p?._id}
              size="small" 
              onClick={() => value?._id !== p?._id && onSubmit(p) }
              disabled={ value?._id === p?._id } selected={ value?._id === p?._id } 
            >
              <Typography variant="body2" noWrap>
                <Iconify icon={p.icon} size="40px" sx={{ ml:1 }}/> { p?.name || ""}
              </Typography>
            </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
}
