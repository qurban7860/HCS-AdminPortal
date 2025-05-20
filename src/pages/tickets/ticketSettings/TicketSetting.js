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

// ----------------------------------------------------------------------

export default function TicketSetting() {

  const navigate = useNavigate();
  const linkIssueType = () => navigate(PATH_SUPPORT.ticketSettings.issueTypes.root);
  const linkRequestType = () => navigate(PATH_SUPPORT.ticketSettings.requestTypes.root);
  const linkPriority = () => navigate(PATH_SUPPORT.ticketSettings.priorities.root);
  const linkStatus = () => navigate(PATH_SUPPORT.ticketSettings.statuses.root);
  const linkStatusType = () => navigate(PATH_SUPPORT.ticketSettings.statusTypes.root);
  const linkImpact = () => navigate(PATH_SUPPORT.ticketSettings.impacts.root);
  const linkChangeType = () => navigate(PATH_SUPPORT.ticketSettings.changeTypes.root);
  const linkChangeReason = () => navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
  const linkInvestigationReason = () => navigate(PATH_SUPPORT.ticketSettings.investigationReasons.root);
  const linkFault = () => navigate(PATH_SUPPORT.ticketSettings.faults.root);

return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Settings" />
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
              <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.REQUEST_SETTINGS} />}
                >
                  <ListItem
                    onClick={linkIssueType}
                    icon={ICONS.ISSUE_TYPES.icon}
                    content={ICONS.ISSUE_TYPES.heading}
                  />
                  <ListItem
                    onClick={linkRequestType}
                    icon={ICONS.REQUEST_TYPES.icon}
                    content={ICONS.REQUEST_TYPES.heading}
                  />
                </List>
              </StyledSettingsCardContainer>

              <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.REQUEST_STATUS_SETTINGS} />}
                >
                  <ListItem
                    onClick={linkStatus}
                    icon={ICONS.STATUSES.icon}
                    content={ICONS.STATUSES.heading}
                  />
                  <ListItem
                    onClick={linkStatusType}
                    icon={ICONS.STATUS_TYPES.icon}
                    content={ICONS.STATUS_TYPES.heading}
                  />
                </List>
              </StyledSettingsCardContainer>
              
              <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.CHANGE_SETTINGS} />}
                >
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
                </List>
              </StyledSettingsCardContainer>

              <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.PRIORITY_SETTINGS} />}
                >
                  <ListItem
                    onClick={linkPriority}
                    icon={ICONS.PRIORITIES.icon}
                    content={ICONS.PRIORITIES.heading}
                  />
                  <ListItem
                    onClick={linkImpact}
                    icon={ICONS.IMPACTS.icon}
                    content={ICONS.IMPACTS.heading}
                  />
                </List>
              </StyledSettingsCardContainer>

              <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.INVESTIGATION_FAULT_SETTINGS} />}
                >
                  <ListItem
                    onClick={linkInvestigationReason}
                    icon={ICONS.INVESTIGATION_REASONS.icon}
                    content={ICONS.INVESTIGATION_REASONS.heading}
                  />
                  <ListItem
                    onClick={linkFault}
                    icon={ICONS.FAULTS.icon}
                    content={ICONS.FAULTS.heading}
                  />
                </List>
              </StyledSettingsCardContainer>
            </Box>
    </Container>
  );
}
