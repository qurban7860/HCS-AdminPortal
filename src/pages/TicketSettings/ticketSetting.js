import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Container, List } from '@mui/material';
// routes
import { PATH_TICKET_SETTING } from '../../routes/paths';
// components
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { StyledSettingsCardContainer } from '../../theme/styles/machine-styles';
import ListItemsHeader from '../../components/ListTableTools/ListItemsHeader';
import ListItem from '../../components/ListTableTools/ListItem';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { ICONS } from '../../constants/icons/default-icons';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function TicketSettings() {

  const { isSettingAccessAllowed } = useAuthContext()

  const navigate = useNavigate();
  const linkSystemProblem = () => navigate(PATH_TICKET_SETTING.SystemProblem.form);
  const linkSystemChange = () => navigate(PATH_TICKET_SETTING.SystemChange.form);
  const linkSystemIncident = () => navigate(PATH_TICKET_SETTING.SystemIncident.form);
  const linkServiceRequest = () => navigate(PATH_TICKET_SETTING.ServiceRequest.form);
  const linkApprovalRequest = () => navigate(PATH_TICKET_SETTING.ApprovalRequest.form);
  const linkElectricalForm = () => navigate(PATH_TICKET_SETTING.Electrical.form);
  const linkHydraulicForm = () => navigate(PATH_TICKET_SETTING.Hydraulic.form);
  const linkMechanicalForm = () => navigate(PATH_TICKET_SETTING.Mechanical.form);
  const linkOffsetForm = () => navigate(PATH_TICKET_SETTING.Offset.form);
  const linkUserInvites = () => navigate(PATH_TICKET_SETTING.invite.list);

return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Ticket Settings" />
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
                  subheader={<ListItemsHeader header={FORMLABELS.ISSUE_TYPES} />}
                >
                  <ListItem
                    onClick={linkSystemProblem}
                    icon={ICONS.SYSTEM_PROBLEM.icon}
                    content={ICONS.SYSTEM_PROBLEM.heading}
                  />
                   <ListItem
                    onClick={linkSystemChange}
                    icon={ICONS.SYSTEM_CHANGE.icon}
                    content={ICONS.SYSTEM_CHANGE.heading}
                  />
                   <ListItem
                    onClick={linkSystemIncident}
                    icon={ICONS.SYSTEM_INCIDENT.icon}
                    content={ICONS.SYSTEM_INCIDENT.heading}
                  />
                   <ListItem
                    onClick={linkServiceRequest}
                    icon={ICONS.SERVICE_REQUEST.icon}
                    content={ICONS.SERVICE_REQUEST.heading}
                  />
                   <ListItem
                    onClick={linkApprovalRequest}
                    icon={ICONS.APPROVALS.icon}
                    content={ICONS.APPROVALS.heading}
                  />
                </List>
                
            </StyledSettingsCardContainer>
            }
            <StyledSettingsCardContainer>
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.COMPONENTS} />}
                >
                  <ListItem
                    onClick={linkElectricalForm}
                    icon={ICONS.ELECTRICAL.icon}
                    content={ICONS.ELECTRICAL.heading}
                  />                 
                  <ListItem
                    onClick={linkHydraulicForm}
                    icon={ICONS.HYDRAULIC.icon}
                    content={ICONS.HYDRAULIC.heading}
                  />
                 <ListItem
                    onClick={linkMechanicalForm}
                    icon={ICONS.MECHANICAL.icon}
                    content={ICONS.MECHANICAL.heading}
                  />
                  <ListItem
                    onClick={linkOffsetForm}
                    icon={ICONS.OFFSET.icon}
                    content={ICONS.OFFSET.heading}
                  />
                </List>

            </StyledSettingsCardContainer>

            <StyledSettingsCardContainer >
                <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={<ListItemsHeader header={FORMLABELS.REPORTS} />}
                >
                  <ListItem
                    onClick={linkUserInvites}
                    icon={ICONS.USER_INVITE.icon}
                    content={ICONS.USER_INVITE.heading}
                  />
                </List>
            </StyledSettingsCardContainer>
          </Box>
    </Container>
  );
}
