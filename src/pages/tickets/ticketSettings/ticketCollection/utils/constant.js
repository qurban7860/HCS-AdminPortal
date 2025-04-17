import * as Yup from 'yup';

export const TicketCollectionSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required('Name is required!'),
  icon: Yup.string().max(50).required('Icon is required!'),
  color: Yup.string().nullable().notRequired().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    {
      message: 'Invalid color!',
      excludeEmptyString: true,
    }),
  description: Yup.string().max(5000),
  isActive: Yup.boolean(),
  isDefault: Yup.boolean(),
  displayOrderNo: Yup.number()
    .typeError('Display Order No. must be a number')
    .nullable()
    .transform((_, val) => (val !== '' ? Number(val) : null)),
  slug: Yup.string().min(0).max(50).matches(/^(?!.*\s)[\S\s]{0,50}$/, 'Slug field cannot contain blankspaces'),
});