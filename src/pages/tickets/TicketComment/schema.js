import * as Yup from 'yup';

export const commentSchema = Yup.object().shape({
    comment: Yup.string(),
    isInternal: Yup.boolean(),
});