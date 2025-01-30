import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Menu, MenuItem, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ticketSchema } from '../../schemas/ticketSchema';
import Iconify from '../../../components/iconify';
import FormProvider from '../../../components/hook-form';

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
  options: PropTypes.array, 
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default function DropDownField( { value, name, label, options = [], isLoading, onSubmit } ) {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const open = Boolean(anchorEl);

    const defaultValues = useMemo(
      () => ({
        [name]: value || null,
      }),[ value, name ]);
      
  const methods = useForm({
    // resolver: yupResolver( ticketSchema ),
    defaultValues,
  });
  
  const { handleSubmit, setValue, reset, watch, formState: { isSubmitting }} = methods;
  const watchedValue = watch( name );

  useEffect(() => {
    reset({ [name]: value || "" }, { keepDirty: false });
  }, [value, name, reset]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMenuItemClick = (iVal) => {
      setValue(name,iVal)
      handleClose();
  };

  const handleFormSubmit = handleSubmit( async (data) => {
    try{
      await onSubmit( name, data[name] || null );
      await reset({ [name]: data[name] }, { keepDirty: false });
    } catch(e){
      console.log(e);
    }
  });

  return (
    <Box sx={{ position: "relative", width: "100%" }} >
        <FormProvider methods={methods} onSubmit={handleFormSubmit} >
        <Box sx={{ width: "100%" }} >
        <Button
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          color={ !watchedValue?.color && "inherit" || undefined }
          startIcon={ watchedValue?.icon && <Iconify icon={ watchedValue?.icon } /> }
          endIcon={
            (
              ( Array.isArray( options ) && 
              options?.length > 0 && 
              <KeyboardArrowDownIcon /> )
            )
          }
          disabled={ isSubmitting }
          sx={{ 
            backgroundColor: watchedValue?.color || "",
            '&:hover': {
              backgroundColor: watchedValue?.color,
            },
          }}
        >
          { watchedValue?.name || `Select ${label || ""}` }
        </Button>
        </Box>
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
          { !isLoading && Array.isArray( options ) && 
            options?.map( ( p ) => 
              <MenuItem 
                key={p?._id}
                size="small"
                color={ value?.color || "inherit" }
                onClick={() => handleMenuItemClick(p) }
                // disabled={ value?._id === p?._id } 
                selected={ value?._id === p?._id } 
                sx={{
                  backgroundColor: p.color ,
                  '&:hover': {
                    backgroundColor: p?.color,
                  },
                }}
              >
                <Iconify icon={p.icon} size="40px" sx={{ mr: 1 }}/> { p?.name || ""}
              </MenuItem>
          )}
        </StyledMenu>}
        { value?._id !== watchedValue?._id && 
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
              onClick={() => reset()}
              sx={{minWidth: 32, padding: '2px', height: 32}}
          >
              <ClearRoundedIcon/>
          </Button>
        </Stack>}
      </FormProvider>
    </Box>
  );
}
