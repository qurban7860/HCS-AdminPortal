import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent } from '@mui/material';

export default function DocumentCover({ content, backLink, generalSettings, machineDrawingsBackLink }) {
  return (
    <Card sx={{alignItems:'flex-end,', position:'sticky', top:'60px', zIndex:'2'}}>
      <CardContent sx={{
                        background:"#103996cc", 
                        color:'#fff', 
                        fontWeight:'bold', 
                        fontSize:'3rem', 
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'flex-end',
                        fontFamily:'Yantramanav,Arimo,Calibri'
                        }}
                        >
                        {content.length > 130? `${content.slice(0, content.lastIndexOf(' ', 130))} ...`: content}
                        </CardContent>
      <CardActions sx={{background:'#fff', height:'50px'}} />
    </Card>
  );
}

DocumentCover.propTypes = {
  content: PropTypes.string,
  backLink: PropTypes.bool,
  machineDrawingsBackLink: PropTypes.bool,
  generalSettings: PropTypes.bool,
};
