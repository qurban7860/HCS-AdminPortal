import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Container, List } from '@mui/material';
// routes
import { PATH_SUPPORT } from '../../../routes/paths';
// components
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { StyledSettingsCardContainer } from '../../../theme/styles/machine-styles';
import ListItemsHeader from '../../../components/ListTableTools/ListItemsHeader';
import ListItem from '../../../components/ListTableTools/ListItem';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { ICONS } from '../../../constants/icons/default-icons';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TicketSetting() {

  const { isSettingAccessAllowed } = useAuthContext()

  const navigate = useNavigate();
  const linkIssueType = () => navigate(PATH_SUPPORT.ticketSettings.issueTypes.root);
  const linkPriority = () => navigate(PATH_SUPPORT.ticketSettings.priorities.root);
  const linkStatus = () => navigate(PATH_SUPPORT.ticketSettings.statuses.root);
  const linkImpact = () => navigate(PATH_SUPPORT.ticketSettings.impacts.root);
  const linkChangeType = () => navigate(PATH_SUPPORT.ticketSettings.changeTypes.root);
  const linkChangeReason = () => navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
  const linkInvestigationReason = () => navigate(PATH_SUPPORT.ticketSettings.investigationReasons.root);

return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Support Ticket Settings" />
      </StyledCardContainer>

          <Box
              rowGap={1}
              columnGap={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
            >
          { isSettingAccessAllowed &&
            <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.TICKET_SETTINGS} />}
                >
                  <ListItem
                    onClick={linkIssueType}
                    icon={ICONS.ISSUE_TYPES.icon}
                    content={ICONS.ISSUE_TYPES.heading}
                  />
                   <ListItem
                    onClick={linkPriority}
                    icon={ICONS.PRIORITIES.icon}
                    content={ICONS.PRIORITIES.heading}
                  />
                   <ListItem
                    onClick={linkStatus}
                    icon={ICONS.STATUSES.icon}
                    content={ICONS.STATUSES.heading}
                  />
                   <ListItem
                    onClick={linkImpact}
                    icon={ICONS.IMPACTS.icon}
                    content={ICONS.IMPACTS.heading}
                  />
                   <ListItem
                    onClick={linkChangeType}
                    icon={ICONS.CHANGE_TYPES.icon}
                    content={ICONS.CHANGE_TYPES.heading}
                  />
                   <ListItem
                    onClick={linkChangeReason}
                    icon={ICONS.CHANGE_REASONS.icon}
                    content={ICONS.CHANGE_REASONS.heading}
                  />
                   <ListItem
                    onClick={linkInvestigationReason}
                    icon={ICONS.INVESTIGATION_REASONS.icon}
                    content={ICONS.INVESTIGATION_REASONS.heading}
                  />
                </List>
                
            </StyledSettingsCardContainer>
            }
          </Box>
    </Container>
  );
}
