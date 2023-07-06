import React from 'react';
import PropTypes from 'prop-types';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Defaults/Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';

export default function DocumentCover({ content }) {
  return (
    <StyledCardCover>
      <Cover name={content} icon="ph:users-light" backLink={PATH_DOCUMENT.document.list} />
    </StyledCardCover>
  );
}

DocumentCover.propTypes = {
  content: PropTypes.string,
};
