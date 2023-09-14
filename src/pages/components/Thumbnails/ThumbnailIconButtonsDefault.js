import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { alpha, useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { ThumbnailIconButton } from '../../../theme/styles/document-styles';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';

// delete icon button
export default function DeleteIconButton({ onClick, left, color, icon }) {
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const disableDelete = userRoles.some((role) => role?.disableDelete === true);
  const theme = useTheme();
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const methods = useForm();
  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  return (
    <Link>
      {!disableDelete && (
        <Link>
          <ThumbnailIconButton
            // disabled={disableDelete}
            theme={theme}
            size="small"
            onClick={handleOpenConfirm}
            sx={{
              left: { left },
              color: alpha(theme.palette.common.white, 0.8),
              bgcolor: alpha(theme.palette.error.dark, 0.6),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.dark, 0.8),
              },
            }}
          >
            <Iconify icon={icon} width={18} />
          </ThumbnailIconButton>
        </Link>
      )}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm();
        }}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isSubmitSuccessful || isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit(onClick)}
          >
            Delete
          </LoadingButton>
        }
      />
    </Link>
  );
}

DeleteIconButton.propTypes = {
  onClick: PropTypes.func,
  left: PropTypes.number,
  color: PropTypes.string,
  icon: PropTypes.string,
};

DeleteIconButton.defaultProps = {
  left: 44,
  icon: 'material-symbols:delete',
};

// template thumbnail Iconbutton

export function ThumbnailIconButtonDefault({ onClick, left, color, icon }) {
  const theme = useTheme();
  return (
    <Link>
      <ThumbnailIconButton
        theme={theme}
        size="small"
        onClick={onClick}
        sx={{
          left: { left },
          color: alpha(theme.palette.common.white, 0.8),
          bgcolor: alpha(theme.palette.grey[900], 0.6),
          '&:hover': {
            bgcolor: alpha(theme.palette.grey[900], 0.8),
          },
        }}
      >
        <Iconify icon={icon} width={18} />
      </ThumbnailIconButton>
    </Link>
  );
}

ThumbnailIconButtonDefault.propTypes = {
  onClick: PropTypes.func,
  left: PropTypes.number,
  color: PropTypes.string,
  icon: PropTypes.string,
};

ThumbnailIconButtonDefault.defaultProps = {
  left: 44,
  color: '#000000',
};
