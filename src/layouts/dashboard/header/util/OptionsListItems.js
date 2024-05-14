import { PATH_SECURITY, PATH_CRM } from '../../../../routes/paths';

export const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: PATH_SECURITY.users.profile,
  },
  // {
  //   label: 'Change Password',
  //   linkTo: PATH_SECURITY.users.password,
  // },
  {
    label: 'Organization',
    linkTo: (id) => PATH_CRM.customers.view(id),
  },
];
