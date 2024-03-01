import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import { CustomAvatarBase } from '../../theme/styles/customer-styles';
import { useScreenSize } from '../../hooks/useResponsive';

ContactSiteCard.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.object,
  image: PropTypes.string,
  handleOnClick:PropTypes.func,
  disableClick:PropTypes.bool,
  isActive:PropTypes.bool
};

export default function ContactSiteCard({name, title, email, phone, image, handleOnClick, disableClick, isActive}) {

  const smScreen = useScreenSize('sm');
  const mdScreen = useScreenSize('md');
  const lgScreen = useScreenSize('lg');
  const xlScreen = useScreenSize('xl');

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
      <CardActionArea sx={{display:'flex', height:'100%', p:0, m:0}} disabled={isActive || disableClick} onClick={handleOnClick}>
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
            <Typography variant="h4" color="#2065d1" component="div">{_name}</Typography>
            <Typography variant="body1" color="text.secondary" component="div">{_title}</Typography>
            <Typography variant="overline" color="text.secondary" component="div">{_email}</Typography>
            <Typography variant="overline" color="text.secondary" component="div">{`${phone?.countryCode ?  '+' : '' }${phone?.countryCode || '' }${phone?.contactNumber || '' }`}</Typography>
          </CardContent>
      </CardActionArea>
    </Card>
  );
}