import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Defaults/Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';

export default function DocumentCover({ content, backLink, generalSettings, machineDrawingsBackLink }) {
  return (
    <Card sx={{alignItems:'flex-end'}}>
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
