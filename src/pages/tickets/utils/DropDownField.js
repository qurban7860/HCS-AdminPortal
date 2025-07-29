import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Box, Button, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';

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

DropDownField.propTypes = {
  value: PropTypes.object, 
  name: PropTypes.string, 
  label: PropTypes.string, 
  isNullable: PropTypes.bool,
  iconButton: PropTypes.bool,
  options: PropTypes.array, 
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function DropDownField( { value, name, label, isNullable, iconButton, options = [], isLoading, onSubmit } ) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const open = Boolean(anchorEl);
  
  const methods = useForm({ });
  const { handleSubmit, formState: { isSubmitting }} = methods;

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMenuItemClick = async ( data ) => {
    try{
      if(value?._id !== data?._id ){
        await onSubmit( name, data );
        handleClose();
      }
    } catch(e){
      console.log(e);
    }
  };

  return (
    <Box >
        {iconButton ?
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledTooltip 
                  title={value.name || ""} 
                  placement="top" 
                  disableFocusListener 
                  color={value?.color || "inherit" } 
                  tooltipcolor={value?.color}
                >
                  <IconButton 
                    variant="outlined"
                    onClick={handleClick}
                  >
                    <Iconify icon={value?.icon || ""} color={value?.color || "inherit" } />
                  </IconButton>
                </StyledTooltip>

                <Typography sx={{ marginLeft: 0.5 }}>{value.ticketNo || ''}</Typography>
              </Box>
               :
        <Button
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          color="inherit"
          startIcon={ value?.icon && <Iconify icon={ value?.icon } color={value?.color || ""} /> }
          endIcon={
            (
              ( isSubmitting ? 
                <Iconify icon="eos-icons:loading" /> : 
                ( Array.isArray( options ) && options?.length > 0 && 
                  <KeyboardArrowDownIcon />
                ) 
              )
            )
          }
          // disabled={ isSubmitting }
        >
          {  value?._id && ( value?.name ? value?.name : `${value?.firstName || "" } ${value?.lastName || ""}`) || `Select ${label || ""}` }
        </Button>}
        { Array.isArray( options ) && options?.length > 0 && <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          { isLoading && (  
            <MenuItem> 
              <Iconify icon="eos-icons:loading" size="40px" sx={{ ml:1 }}/> Loading... 
            </MenuItem>
          )}
                      { isNullable && <MenuItem 
                        key="null"
                        size="small"
                        onClick={() => handleSubmit(handleMenuItemClick( null )) }
                        selected={ value === null } 
                        color="inherit"
                      >Select { label || ""}
                        </MenuItem>}
          { !isLoading && Array.isArray( options ) && 

            options?.map( ( p ) => 
              <MenuItem 
                key={p?._id}
                size="small"
                onClick={() => handleSubmit(handleMenuItemClick(p)) }
                // disabled={ value?._id === p?._id } 
                selected={ value?._id === p?._id } 
                // color={ !p?.color && "inherit" || "#fff" }
              >
                <Iconify icon={p.icon} color={p?.color || "inherit" } size="40px" sx={{ mr: 1 }} /> { p?.name ? p?.name : `${p?.firstName || "" } ${p?.lastName || ""}` || ""}
              </MenuItem>
          )}
        </StyledMenu>}
    </Box>
  );
}
