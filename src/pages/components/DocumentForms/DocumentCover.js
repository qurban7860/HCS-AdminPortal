import React from 'react';
import PropTypes from 'prop-types';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';

export default function DocumentCover({ content, backLink, generalSettings}) {
  return (
    <StyledCardCover>
      <Cover name={content} icon="ph:users-light" backLink={backLink ? PATH_DOCUMENT.document.list : ''} generalSettings />
    </StyledCardCover>
  );
}

DocumentCover.propTypes = {
  content: PropTypes.string,
  backLink: PropTypes.bool,
  generalSettings: PropTypes.bool,
};
