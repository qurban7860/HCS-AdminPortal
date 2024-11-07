import { useNavigate } from 'react-router-dom';
import { Box, Container, List } from '@mui/material';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// components
import { StyledSettingsCardContainer } from '../../theme/styles/machine-styles';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import ListItem from '../../components/ListTableTools/ListItem';
import ListItemsHeader from '../../components/ListTableTools/ListItemsHeader';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { ICONS } from '../../constants/icons/default-icons';
// import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function Machine() {
  const navigate = useNavigate();
  
  const linkGroup = () => navigate(PATH_MACHINE.machines.machineSettings.groups.root);
  const linkCategory = () => navigate(PATH_MACHINE.machines.machineSettings.categories.root);
  const linkModel = () => navigate(PATH_MACHINE.machines.machineSettings.models.root);
  const linkStatus = () => navigate(PATH_MACHINE.machines.machineSettings.status.root);
  const linkSupplier = () => navigate(PATH_MACHINE.machines.machineSettings.suppliers.root);
  const linkTechParam = () => navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.root);
  const linktpCategory = () => navigate(PATH_MACHINE.machines.machineSettings.technicalParameterCategories.root);
  const linkTool = () => navigate(PATH_MACHINE.machines.machineSettings.tools.root);
  const linkCheckItemCategory = () => navigate(PATH_MACHINE.machines.machineSettings.checkItemCategories.root);
  const checkItems = () => navigate(PATH_MACHINE.machines.machineSettings.checkItems.root);
  const linkServiceReportsTemplate = () => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.root);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={FORMLABELS.COVER.SETTINGS} />
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
                subheader={<ListItemsHeader header={FORMLABELS.COMMON_SETTINGS} />}
              >
                <ListItem
                  onClick={linkGroup}
                  icon={ICONS.MACHINE_GROUPS.icon}
                  content={ICONS.MACHINE_GROUPS.heading}
                />
                <ListItem
                  onClick={linkCategory}
                  icon={ICONS.MACHINE_CATEGORIES.icon}
                  content={ICONS.MACHINE_CATEGORIES.heading}
                />
                <ListItem
                  onClick={linkModel}
                  icon={ICONS.MACHINE_MODELS.icon}
                  content={ICONS.MACHINE_MODELS.heading}
                />
                <ListItem
                  onClick={linkSupplier}
                  icon={ICONS.MACHINE_SUPPLIERS.icon}
                  content={ICONS.MACHINE_SUPPLIERS.heading}
                />
              </List>
            </StyledSettingsCardContainer>

            <StyledSettingsCardContainer>
              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.SERVICE} />}
              >
                <ListItem
                  onClick={linkCheckItemCategory}
                  icon={ICONS.MACHINE_SERVICE_CATEGORY.icon}
                  content={ICONS.MACHINE_SERVICE_CATEGORY.heading}
                />
                <ListItem
                  onClick={checkItems}
                  icon={ICONS.MACHINE_CHECK_ITEMS.icon}
                  content={ICONS.MACHINE_CHECK_ITEMS.heading}
                />
                <ListItem
                  onClick={linkServiceReportsTemplate}
                  icon={ICONS.TOOLS.icon}
                  content={ICONS.MACHINE_SERVICE_REPORT_CONFIG.heading}
                />
              </List>
          </StyledSettingsCardContainer>

          <StyledSettingsCardContainer>
              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.TECHNICAL_SETTINGS} />}
              >
                <ListItem
                  onClick={linktpCategory}
                  icon={ICONS.TECHPARAM_CATEGORIES.icon}
                  content={ICONS.TECHPARAM_CATEGORIES.heading}
                />
                <ListItem
                  onClick={linkTechParam}
                  icon={ICONS.PARAMETERS.icon}
                  content={ICONS.PARAMETERS.heading}
                />
              </List>
          </StyledSettingsCardContainer>

          <StyledSettingsCardContainer>
              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.TOOLS_INFO} />}
              >
                <ListItem
                  onClick={linkTool}
                  icon={ICONS.TOOLS.icon}
                  content={ICONS.TOOLS.heading}
                />
              </List>
            </StyledSettingsCardContainer>

            <StyledSettingsCardContainer>
              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.OTHERS} />}
              >
                <ListItem
                  onClick={linkStatus}
                  icon={ICONS.MACHINE_STATUS.icon}
                  content={ICONS.MACHINE_STATUS.heading}
                />
              </List>
            </StyledSettingsCardContainer>
      </Box>
    </Container>
  );
}
