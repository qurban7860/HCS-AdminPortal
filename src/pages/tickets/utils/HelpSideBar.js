import PropTypes from 'prop-types';
import {
  Drawer,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconTooltip from '../../../components/Icons/IconTooltip';
import Editor from '../../../components/editor';

export default function HelpSidebar({ open, onClose, article }) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '50vw' },
          p: 3,
          maxHeight: '100vh',
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.5, mt: -1.5 }}>
        <IconTooltip
          title="Back"
          onClick={onClose}
          color={theme.palette.primary.main}
          icon="mdi:arrow-left"
        />
      </Box>

      <Divider sx={{ mb: 1 }} />

      { article && (article.title?.trim() || article.description?.trim()) ? (
        <Box>
          {article.title && (
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: '1.4rem' }}
            >
              {article.title}
            </Typography>
          )}

          {article.description && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              <Editor
                readOnly
                hideToolbar
                sx={{
                  border: 'none',
                  '& .ql-editor': { padding: '0px' },
                }}
                value={article.description}
              />
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body2">
            No support article is available at the moment. Please contact your support team if you need assistance.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}

HelpSidebar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  article: PropTypes.object,
};
