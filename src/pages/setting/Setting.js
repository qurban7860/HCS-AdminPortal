import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Grid, List } from '@mui/material';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { StyledSettingsCardContainer } from '../../theme/styles/machine-styles';
import ListItemsHeader from '../components/ListTableTools/ListItemsHeader';
import ListItem from '../components/ListTableTools/ListItem';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { ICONS } from '../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export default function Setting() {
  const navigate = useNavigate();
  // Functions to navigate to different pages
  const linkDocumentType = () => {
    navigate(PATH_SETTING.documentType.list);
  };
  const linkDocumentCategory = () => {
    navigate(PATH_SETTING.documentCategory.list);
  };
  const linkRole = () => {
    navigate(PATH_SETTING.role.list);
  };
  const linkSignInLogs = () => {
    navigate(PATH_SETTING.signInLogs.list);
  };
  const linkRegions = () => {
    navigate(PATH_SETTING.regions.list);
  };
  const linkModules = () => {
    navigate(PATH_SETTING.modules.list);
  };
  const linkUserConfig = () => {
    navigate(PATH_SETTING.userConfig.list);
  }
  const linkConfigs = () => {
    navigate(PATH_SETTING.configs.list);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={FORMLABELS.COVER.SETTINGS} />
      </StyledCardContainer>
      <Grid container gap={3}>
        {/* Grid for displaying Settings related information */}

        <Grid item xs={12} md={6} lg={4}>
          <StyledSettingsCardContainer>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={<ListItemsHeader header={FORMLABELS.DOCUMENT_SETTINGS} />}
            >
              <ListItem
                onClick={linkDocumentCategory}
                icon={ICONS.DOCUMENT_CATEGORY.icon}
                content={ICONS.DOCUMENT_CATEGORY.heading}
              />
              <ListItem
                onClick={linkDocumentType}
                icon={ICONS.DOCUMENT_TYPE.icon}
                content={ICONS.DOCUMENT_TYPE.heading}
              />
            </List>
          </StyledSettingsCardContainer>
          <StyledSettingsCardContainer>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={<ListItemsHeader header={FORMLABELS.SECURITY_SETTINGS} />}
            >
              <ListItem
                onClick={linkRegions}
                icon={ICONS.REGION.icon}
                content={ICONS.REGION.heading}
              />
               <ListItem
                onClick={linkModules}
                icon={ICONS.MODULE.icon}
                content={ICONS.MODULE.heading}
              />
              <ListItem
                onClick={linkConfigs}
                icon={ICONS.CONFIG.icon}
                content={ICONS.CONFIG.heading}
              />
              <ListItem
                onClick={linkRole}
                icon={ICONS.SECURITY_ROLES.icon}
                content={ICONS.SECURITY_ROLES.heading}
              />
              <ListItem
                onClick={linkSignInLogs}
                icon={ICONS.SIGNIN_LOGS.icon}
                content={ICONS.SIGNIN_LOGS.heading}
              /> 
              <ListItem
                onClick={linkUserConfig}
                icon={ICONS.USER_CONFIG.icon}
                content={ICONS.USER_CONFIG.heading}
              />             
            </List>
          </StyledSettingsCardContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
