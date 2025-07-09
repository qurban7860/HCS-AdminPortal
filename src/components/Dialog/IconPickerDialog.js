import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Box, InputBase, Typography, Divider, Tabs, Tab, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import SearchIcon from '@mui/icons-material/Search';

const ICON_SETS = {
  Common: [
    'mdi:home', 'mdi:account', 'mdi:alert', 'mdi:users-add', 'mdi:calendar', 'mdi:check-circle', "mdi:console", 'mdi:history',
    'mdi:star', 'mdi:cart', 'mdi:bell', 'mdi:book', 'mdi:code-json', 'mdi:camera', 'mdi:chat', 'ic:outline-verified-user', 'mdi:shield-outline',
    'mdi:cloud', 'mdi:email', 'mdi:file', 'mdi:map-marker', 'mdi:phone', 'mdi:cog', "mdi:file-pdf-box", 'mdi:required-circle',
    'mdi:shield', 'mdi:tag', 'mdi:wallet', "mdi:fullscreen", 'mdi:close-box-outline', 'mdi:graph-bar', 'mdi:chart-line', 'mdi:heart', 'mdi:account-multiple'
  ],
  Actions: [
    'mdi:search', 'mdi:plus', 'mdi:minus', 'mdi:close',
    'mdi:check', "mdi:archive", 'mdi:delete', 'mdi:pencil',
    'mdi:refresh', 'mdi:download', 'mdi:upload',
    'mdi:menu', 'mdi:dots-vertical', 'mdi:arrow-left',
    'mdi:arrow-right', 'mdi:chevron-up', 'mdi:chevron-down',
    "mdi:merge", 'mdi:ban', "mdi:view-list", "mdi:view-grid"
  ],
  Objects: [
    'mdi:folder', 'mdi:file-document', 'mdi:image',
    'mdi:database', 'mdi:lock', 'mdi:key', "mdi:api",
    'mdi:package', 'mdi:credit-card', 'mdi:gift', "mdi:security-account",
    'mdi:briefcase', 'mdi:cube', 'mdi:printer', "mdi:folder-multiple"
  ],
  Status: [
    'mdi:list-status', 'mdi:stop-remove', 'mdi:check-circle-outline', 'mdi:information-outline',
    'mdi:close-circle-outline', 'mdi:help-circle-outline', 'mdi:clock', 'mdi:source-branch-minus',
    'mdi:eye', 'mdi:eye-off', 'mdi:bell-outline', 'mdi:check-decagram', 'mdi:alert-decagram',
    'mdi:thumb-up-outline', 'mdi:thumb-down-outline', 'mdi:flag-outline',
  ]
};

export default function IconPickerDialog({ open, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Common');

  const allIcons = useMemo(() => Object.values(ICON_SETS).flat(), []);

  const filteredIcons = useMemo(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      return allIcons.filter(icon => icon.split(':')[1].toLowerCase().includes(searchTerm));
    }
    return ICON_SETS[activeTab] || [];
  }, [query, activeTab, allIcons]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setQuery('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '70vh',
          maxHeight: 600,
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <SearchIcon fontSize="small" />
          <InputBase
            placeholder="Search icons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ 
              ml: 1, 
              flex: 1,
              '& input': { 
                fontSize: '1.1rem',
                py: 1
              }
            }}
            autoFocus
          />
        </Box>
      </DialogTitle>

      <Divider />

      {!query && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          {Object.keys(ICON_SETS).map((key) => (
            <Tab key={key} label={key} value={key} sx={{ minWidth: 'unset', px: 1.5 }} />
          ))}
        </Tabs>
      )}

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {filteredIcons.length ? (
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              p: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: 1.5,
              alignContent: 'flex-start',
              py: 1,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: (theme) => theme.palette.grey[400], borderRadius: '10px' },
            '&::-webkit-scrollbar-track': { backgroundColor: (theme) => theme.palette.grey[200] },
            }}
          >
            {filteredIcons.map((icon) => (
              <Stack
                key={icon}
                onClick={() => { onSelect(icon); onClose(); }}
                alignItems="center"
                justifyContent="center"
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, background-color 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)'},
                }}
              >
                <Icon icon={icon} width={32} height={32} style={{ marginBottom: 4 }} />
                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                  }}
                >
                  {icon.split(':')[1].replace(/-/g, ' ')}
                </Typography>
              </Stack>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="body2">
              {query ? 'No matching icons found' : 'Select a category'}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

IconPickerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};