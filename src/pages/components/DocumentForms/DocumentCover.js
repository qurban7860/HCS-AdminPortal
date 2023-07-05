import React from 'react';
import PropTypes from 'prop-types';
import { StyledCardCover } from '../../../theme/styles/document-styles';
import { Cover } from '../Defaults/Cover';

export default function DocumentCover({ content }) {
  return (
    <StyledCardCover>
      <Cover name={content} icon="ph:users-light" />
    </StyledCardCover>
  );
}

DocumentCover.propTypes = {
  content: PropTypes.string,
};
