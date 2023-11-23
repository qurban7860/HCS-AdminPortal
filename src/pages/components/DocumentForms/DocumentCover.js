import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Defaults/Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';

export default function DocumentCover({ content, backLink, generalSettings, machineDrawingsBackLink }) {
  return (
    <Card sx={{alignItems:'flex-end'}}>
      {/* <CardHeader title={content} sx={{height:'150px', fontSize:'30%', color:'white', background:'#103996cc'}} /> */}
      <CardContent sx={{
                        background:"#103996cc", 
                        color:'#fff', 
                        fontWeight:'bold', 
                        fontSize:'100%', 
                        height:'150px',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'flex-end'
                        }}
                        >{content}</CardContent>
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
