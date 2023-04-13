export const AddContactSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    title: Yup.string(),
    contactTypes: Yup.array(),
    // phone: Yup.string(),
    email: Yup.string().trim('The email name cannot include leading and trailing spaces').email('Email must be a valid email address'),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    postcode: Yup.string().matches(numberRegExp, {message: "Please enter valid number.", excludeEmptyString: true}).min(0),
    // country: Yup.string().nullable()
  });