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

// ----------------------------------------------------------------------

export default function Machine() {
  const navigate = useNavigate();

  // Functions to navigate to different pages
  const linkGroup = () => {
    console.log('hiii',PATH_MACHINE.machines.settings.groups.list)
    navigate(PATH_MACHINE.machines.settings.groups.list);
    // navigate(PATH_MACHINE.machines.settings.groups.list);
  };

  const linkCategory = () => {
    navigate(PATH_MACHINE.machines.settings.categories.list);
  };
  const linkModel = () => {
    navigate(PATH_MACHINE.machines.settings.model.list);
  };
  const linkStatus = () => {
    navigate(PATH_MACHINE.machines.settings.status.list);
  };
  const linkSupplier = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.list);
  };
  const linkTechParam = () => {
    navigate(PATH_MACHINE.machines.settings.parameters.list);
  };
  const linktpCategory = () => {
    navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.list);
  };
  const linkTool = () => {
    navigate(PATH_MACHINE.machines.settings.tool.list);
  };
  const checkItems = () => {
    navigate(PATH_MACHINE.machines.settings.checkItems.list);
  }
  const linkServiceRecordConfig = () => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
  };

  const linkServiceCategory = () => {
    navigate(PATH_MACHINE.machines.settings.serviceCategories.list);
  };
  const linkConfiguration = () => {
    navigate(PATH_MACHINE.machines.settings.configuration.list)
  }

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
                sm: 'repeat(1, 1fr)', // First one spans 1 column, and the second spans 5 columns on sm screens
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
                <ListItem
                  onClick={linkStatus}
                  icon={ICONS.MACHINE_STATUS.icon}
                  content={ICONS.MACHINE_STATUS.heading}
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
                  onClick={linkServiceCategory}
                  icon={ICONS.MACHINE_SERVICE_CATEGORY.icon}
                  content={ICONS.MACHINE_SERVICE_CATEGORY.heading}
                />
                <ListItem
                  onClick={checkItems}
                  icon={ICONS.MACHINE_CHECK_ITEMS.icon}
                  content={ICONS.MACHINE_CHECK_ITEMS.heading}
                />
                <ListItem
                  onClick={linkServiceRecordConfig}
                  icon={ICONS.TOOLS.icon}
                  content={ICONS.MACHINE_SERVICE_RECORD_CONFIG.heading}
                />
                <ListItem
                  onClick={linkConfiguration}
                  icon={ICONS.Configuration.icon}
                  content={ICONS.Configuration.heading}
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

      </Box>
    </Container>
  );
}
