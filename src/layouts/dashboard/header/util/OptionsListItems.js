import { PATH_SECURITY } from '../../../../routes/paths';

export const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_SECURITY.users.profile,
  },
  {
    label: 'Change Password',
    linkTo: PATH_SECURITY.users.password,
  },
];
