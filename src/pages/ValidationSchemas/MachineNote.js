export const MachineNoteSchema = Yup.object().shape({
    note: Yup.string().max(10000).required("Note Field is required!"),
  });