import PropTypes from 'prop-types';
// @mui
import { List, Stack } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
//
import { StyledSubheader } from './styles';
import NavList from './NavList';

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
};

export default function NavSectionVertical({ data, sx, ...other }) {
  const { translate } = useLocales();

  return (
    <Stack sx={sx} {...other}>
          {data && data.length > 0 && data.map((group) => (
            <List key={group.subheader} disablePadding sx={{ px: 1 }}>
              {group.subheader && (
                <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>
              )}
              {group.items.map((list) => (
                <NavList
                  key={list.title + list.path}
                  data={list}
                  depth={1}
                  hasChild={!!list.children}
                  sx={{}}
                />
              ))}
            </List>
          ))}
    </Stack>
  );
}