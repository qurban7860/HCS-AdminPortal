const ToolInstalledSchema = Yup.object().shape({
    note: Yup.string().max(5000),
    isDisabled : Yup.boolean(),
  });