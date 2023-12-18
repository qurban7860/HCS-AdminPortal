export const CustomerNoteSchema = Yup.object().shape({
    note: Yup.string().max(5000).required("Note Field is required!"),
    // customer: Yup.string().nullable(),
    site: Yup.string().nullable(),
    // user: Yup.string(),
    contact: Yup.string().nullable(),
  });