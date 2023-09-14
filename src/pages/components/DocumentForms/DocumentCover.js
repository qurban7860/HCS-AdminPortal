import React from 'react';
import PropTypes from 'prop-types';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Defaults/Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';

export default function DocumentCover({ content, backLink, generalSettings, machineDrawingsBackLink }) {
  return (
    <StyledCardCover>
      <Cover
        name={content}
        icon="ph:users-light"
        machineDrawingsBackLink={machineDrawingsBackLink ? PATH_DOCUMENT.document.machineDrawings.list : ''}
        backLink={backLink ? PATH_DOCUMENT.document.list : ''}
        generalSettings
      />
    </StyledCardCover>
  );
}

DocumentCover.propTypes = {
  content: PropTypes.string,
  backLink: PropTypes.bool,
  machineDrawingsBackLink: PropTypes.bool,
  generalSettings: PropTypes.bool,
};
