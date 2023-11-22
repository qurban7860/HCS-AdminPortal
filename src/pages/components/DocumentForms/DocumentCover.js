import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader } from '@mui/material';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Defaults/Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';

export default function DocumentCover({ content, backLink, generalSettings, machineDrawingsBackLink }) {
  return (
    <Card sx={{alignItems:'flex-end'}}>
      <CardHeader title={content} titleTypographyProps={{variant:'h2', component:'h2'}} sx={{height:'115px', color:'white', background:'#103996cc'}} />
      <CardContent/>
    </Card>
  );
}

DocumentCover.propTypes = {
  content: PropTypes.string,
  backLink: PropTypes.bool,
  machineDrawingsBackLink: PropTypes.bool,
  generalSettings: PropTypes.bool,
};
