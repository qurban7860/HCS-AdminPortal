import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { CardActionArea, Grid } from '@mui/material';
import { CustomAvatarBase } from '../../theme/styles/customer-styles';
import { useScreenSize } from '../../hooks/useResponsive';
import Iconify from '../iconify';
import { StyledTooltip } from '../../theme/styles/default-styles';
import { ICONS } from '../../constants/icons/default-icons';

ContactSiteCard.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.any,
  image: PropTypes.string,
  isMain: PropTypes.bool,
  isFormerEmployee: PropTypes.bool,
  handleOnClick:PropTypes.func,
  disableClick:PropTypes.bool,
  isActive:PropTypes.bool
};

export default function ContactSiteCard({ name, title, email, phone, image, isMain, isFormerEmployee, handleOnClick, disableClick, isActive }) {

  const smScreen = useScreenSize('sm');
  const mdScreen = useScreenSize('md');
  const lgScreen = useScreenSize('lg');
  const xlScreen = useScreenSize('xl');

  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  let _name = name?.length>20 ?`${name.substring(0,20)}...`:name;
  let _title = title?.length>20 ?`${title.substring(0,20)}...`:title;
  let _email = email?.length>20 ?`${email.substring(0,20)}...`:email;
  
  if(mdScreen){
    _name = name?.length>30 ?`${name.substring(0,30)}...`:name;
    _title = title?.length>30 ?`${title.substring(0,30)}...`:title;
    _email = email?.length>30 ?`${email.substring(0,30)}...`:email;    
  }

  if(lgScreen){
    _name = name?.length>20?`${name.substring(0,20)}...`:name;
    _title = title?.length>20?`${title.substring(0,20)}...`:title;
    _email = email?.length>20?`${email.substring(0,20)}...`:email;
  }

  if(xlScreen){
    _name = name?.length>30 ?`${name.substring(0,30)}...`:name;
    _title = title?.length>30 ?`${title.substring(0,30)}...`:title;
    _email = email?.length>30 ?`${email.substring(0,30)}...`:email;    
  }
  
  return (
    <Card sx={{ display: 'flex', height:smScreen && '200px', width:'100%', borderRadius:'8px', background:isActive?'#e9ecfe':''}}>
      <CardActionArea sx={{display:'flex', height:'100%', p:0, m:0}} disabled={disableClick} onClick={handleOnClick}>
        {smScreen &&
          <>
            {image ? (
              <CardMedia component="img" sx={{ width: 150, height:'100%', opacity:0.5 }} image={image} alt={_name} />
              ):(
                <Grid sx={{background:'#939ec5', width: 150, height:'100%'}} item display='flex' alignItems='center'>
                <CustomAvatarBase name={name} alt={name}  />
              </Grid>
            )}
          </> 
        }
          <CardContent sx={{ flex: '1 0 auto',  height:'100%', width:'calc(100% - 150px)'}}>
          {isMain && 
              <Grid
                sx={{ position: 'absolute', top: 5, right: 5 }}
              >
                <StyledTooltip
                  title="Main Site"
                  placement="top" 
                  disableFocusListener 
                  tooltipcolor={theme.palette.primary.main} 
                  >
                  <Iconify icon="f7:dot-square-fill" color="#1769aa" />
                </StyledTooltip>
              </Grid>
            }            
            
            { isFormerEmployee !== undefined && 
              <Grid
                sx={{ position: 'absolute', top: 5, right: 5, zIndex:'10' }}
              >
                <StyledTooltip
                  title={ isFormerEmployee ? ICONS.FORMEREMPLOYEE.heading : ICONS.NOTFORMEREMPLOYEE.heading }
                  tooltipcolor={ isFormerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color } 
                  placement="top" 
                  disableFocusListener 
                  >
                  <Iconify 
                    icon={ isFormerEmployee ? ICONS.FORMEREMPLOYEE.icon : ICONS.NOTFORMEREMPLOYEE.icon } 
                    color={ isFormerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color } />
                </StyledTooltip>
              </Grid>
            }
            
            {isActive !== undefined && (
            <Grid sx={{ position: 'absolute', top: 5, right: 25, zIndex: '10' }}>
              <StyledTooltip
                title={ ICONS.ACTIVE.heading } 
                tooltipcolor={ ICONS.ACTIVE.color } 
                placement="top" 
                disableFocusListener >
                <Iconify 
                icon={ICONS.ACTIVE.icon}
                color={ICONS.ACTIVE.color} />
              </StyledTooltip>             
            </Grid> )}

            <Typography variant="h4" color="#2065d1" component="div">{_name}</Typography>
            <Typography variant="body1" color="text.secondary" component="div">{_title}</Typography>
            <Typography variant="overline" color="text.secondary" component="div">{_email}</Typography>
            <Typography variant="overline" color="text.secondary" component="div">{`${phone?.countryCode ?  '+' : '' }${phone?.countryCode || '' }${phone?.contactNumber || '' }`}</Typography>
          </CardContent>
      </CardActionArea>
    </Card>
  );
}