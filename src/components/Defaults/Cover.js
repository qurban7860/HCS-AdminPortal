import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Button, Grid, Typography, Box, IconButton } from '@mui/material';
import { StyledRoot, StyledInfo, StyledTooltip } from '../../theme/styles/default-styles';
// utils
import { PATH_CRM, PATH_MACHINE, PATH_REPORTS, PATH_SETTING, PATH_SUPPORT } from '../../routes/paths';
// auth
import CoverSettingsIcons from './CoverSettingsIcons';
import CoverTitles from './CoverTitles';
import useResponsive from '../../hooks/useResponsive';
import CoverAvatar from './CoverAvatar';
import Iconify from '../iconify';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

Cover.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  avatar: PropTypes.bool,
  setting: PropTypes.bool,
  generalSettings: PropTypes.bool,
  backLink: PropTypes.bool,
  isArchived: PropTypes.bool,
  isArchivedCustomers: PropTypes.bool,
  isArchivedMachines: PropTypes.bool,
  productionLogs: PropTypes.bool,
  coilLogs: PropTypes.bool,
  supportTicketSettings: PropTypes.bool,
  SubOnClick: PropTypes.func,
  addButton: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  buttonIcon: PropTypes.string,
  archivedLink: PropTypes.object,
};

export function Cover({
  name,
  icon,
  avatar,
  setting,
  generalSettings,
  backLink,
  isArchived,
  isArchivedCustomers,
  isArchivedMachines,
  productionLogs,
  coilLogs,
  supportTicketSettings,
  SubOnClick,
  addButton,
  buttonIcon,
  archivedLink
}) {
  const navigate = useNavigate();
  const handleSettingsNavigate = () => navigate(PATH_SETTING.root);
  const handleSupportTicketSettingsNavigate = () => navigate(PATH_SUPPORT.settings.root);
  const linkArchivedCustomers = () => navigate(PATH_CRM.customers.archived.root);
  const linkArchivedMachines = () => navigate(PATH_MACHINE.archived.root);
  const handleBackLink = () => window.history.back();
  const handleCoilLog = () => navigate(PATH_REPORTS.machineLogs.CoilLogs);
  const handleProductionLog = () => navigate(PATH_REPORTS.machineLogs.ProductionLogs);
  const { isAllAccessAllowed, isSettingReadOnly } = useAuthContext();
  const isMobile = useResponsive('down', 'sm');
  const [expandedButton, setExpandedButton] = useState(null);

  const handleClick = (buttonId) => {
    setExpandedButton(prev => (prev === buttonId ? null : buttonId));
  };

  const handleOnClick = async (buttonId, action) => {
    if (isMobile) {
      handleClick(buttonId);
      await new Promise(resolve => setTimeout(resolve, 300));
      action();
    } else {
      action();
    }
  };

  return (
    <StyledRoot style={{ p: { xs: 0, md: 0 } }} isArchived={isArchived}>
      <StyledInfo
        style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }}
      >
        {avatar && <CoverAvatar avatar={name} />}
        <CoverTitles title={avatar && isMobile ? '' : name} />
        <CoverSettingsIcons
          setting={!isArchived && setting}
          handleSettingsNavigate={handleSettingsNavigate}
          generalSettings={generalSettings && !isArchived}
          supportTicketSettings={supportTicketSettings}
          handleSupportTicketSettingsNavigate={handleSupportTicketSettingsNavigate}
        />
      </StyledInfo>
      <Grid
        container
        justifyContent="space-between"
        columnGap={2}
        sx={{ position: 'absolute', bottom: 10, px: 3 }}
      >
        <Grid item>
          {backLink && (
            <Button
              size="small"
              startIcon={<Iconify icon="mdi:arrow-left" />}
              variant="outlined"
              sx={{ float: 'left' }}
              onClick={() => handleOnClick('back', handleBackLink)}
            >
              {' '}
              {(!isMobile || expandedButton === 'back') && (
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Back
                </Typography>
              )}
            </Button>
          )}
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: isMobile ? 'center' : 'flex-start',
              textAlign: 'center',
              '& .MuiButton-startIcon': { marginRight: 0 },
              marginBottom: addButton ? -0.6 : 0,
            }}
          >
            {archivedLink && (
              <Button
                size="small"
                startIcon={archivedLink?.icon ? <Iconify icon={archivedLink.icon} sx={{ mr: 0.5 }} /> : null}
                variant="outlined"
                onClick={() => handleOnClick('archivedCustomers', archivedLink.link)}
              >
                {' '}
                {(!isMobile || expandedButton === 'archivedCustomers') && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    {archivedLink.label}
                  </Typography>
                )}
              </Button>
            )}
            {isAllAccessAllowed && !isSettingReadOnly && isArchivedCustomers && (
              <Button
                size="small"
                startIcon={<Iconify icon="fa6-solid:users-slash" sx={{ mr: 0.5 }} />}
                variant="outlined"
                onClick={() => handleOnClick('archivedCustomers', linkArchivedCustomers)}
              >
                {' '}
                {(!isMobile || expandedButton === 'archivedCustomers') && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    Archived Customers
                  </Typography>
                )}
              </Button>
            )}
            {isAllAccessAllowed && !isSettingReadOnly && isArchivedMachines && (
              <Button
                size="small"
                startIcon={<Iconify icon="fluent:table-delete-column-16-filled" sx={{ mr: 0.3 }} />}
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={linkArchivedMachines}
              >
                Archived Machines
              </Button>
            )}
            {coilLogs && (
              <Button
                size="small"
                startIcon={<Iconify icon="mdi:graph-bar" sx={{ mr: 0.3 }} />}
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => handleOnClick('coilLog', handleCoilLog)}
              >
                {' '}
                {(!isMobile || expandedButton === 'coilLog') && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    Coil Logs
                  </Typography>
                )}
              </Button>
            )}
            {productionLogs && (
              <Button
                size="small"
                startIcon={<Iconify icon="mdi:chart-line" sx={{ mr: 0.3 }} />}
                variant="outlined"
                onClick={() => handleOnClick('productionLog', handleProductionLog)}
              >
                {' '}
                {(!isMobile || expandedButton === 'productionLog') && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                  >
                    Production Logs
                  </Typography>
                )}
              </Button>
            )}
            {addButton && SubOnClick && (
              <Grid item >
                <StyledTooltip title={addButton} placement="bottom" disableFocusListener tooltipcolor="#103996" color="#fff">
                  <IconButton color="#fff" onClick={SubOnClick}
                    sx={{
                      background: "#2065D1", borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                      '&:hover': {
                        background: "#103996",
                        color: "#fff"
                      }
                    }}>
                    <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon={buttonIcon || 'eva:plus-fill'} />
                  </IconButton>
                </StyledTooltip>
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
