import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MenuPopover from '../menu-popover/MenuPopover';
import ViewFormField from './ViewFormField';

function ViewFormCodeMenuPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ width: 250 }}>
        <ViewFormField  chips={ListArr} />
    </MenuPopover>
  );
}

export default memo(ViewFormCodeMenuPopover);

ViewFormCodeMenuPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};
