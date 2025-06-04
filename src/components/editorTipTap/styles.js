import { styled, alpha } from '@mui/material/styles';
import { editorClasses } from './classes';

const MARGIN = '0.75em';

export const EditorRoot = styled('div', {
  shouldForwardProp: (prop) => !['error', 'disabled', 'fullScreen', 'sx'].includes(prop),
})(({ error, disabled, fullScreen, theme }) => ({
  minHeight: 240,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.text.disabled} ${theme.palette.divider}`,

  ...(error && { border: `solid 1px ${theme.palette.error.main}` }),
  ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
  ...(fullScreen && {
    top: 16,
    left: 16,
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    maxHeight: 'unset !important',
    width: `calc(100% - 32px)`,
    height: `calc(100% - 32px)`,
    backgroundColor: theme.palette.background.paper,
  }),

  [`& .${editorClasses.content.placeholder}`]: {
    '&:first-of-type::before': {
      ...theme.typography.body2,
      height: 0,
      float: 'left',
      pointerEvents: 'none',
      content: 'attr(data-placeholder)',
      color: theme.palette.text.disabled,
    },
  },

  [`& .${editorClasses.content.root}`]: {
    display: 'flex',
    flex: '1 1 auto',
    overflowY: 'auto',
    flexDirection: 'column',
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'inherit',
    backgroundColor: theme.palette.background.paper,
    ...(error && { backgroundColor: theme.palette.error.light }),

    '& .tiptap': {
      '> * + *': { marginTop: 0, marginBottom: MARGIN },
      '&:first-child': {
        marginTop: 0,
      },
      '&.ProseMirror': { flex: '1 1 auto', outline: 'none', padding: theme.spacing(0, 2) },

      h1: { ...theme.typography.h1, marginTop: 40, marginBottom: 8 },
      h2: { ...theme.typography.h2, marginTop: 40, marginBottom: 8 },
      h3: { ...theme.typography.h3, marginTop: 24, marginBottom: 8 },
      h4: { ...theme.typography.h4, marginTop: 24, marginBottom: 8 },
      h5: { ...theme.typography.h5, marginTop: 24, marginBottom: 8 },
      h6: { ...theme.typography.h6, marginTop: 24, marginBottom: 8 },
      p: { ...theme.typography.body1, marginBottom: '1.25rem' },

      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '1em 0',
        tableLayout: 'fixed',
        border: `1px solid ${theme.palette.divider}`,
      },

      'th, td': {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
        textAlign: 'left',
        verticalAlign: 'top',
        backgroundColor: theme.palette.background.paper,
      },

      th: {
        fontWeight: theme.typography.fontWeightMedium,
        backgroundColor: theme.palette.grey[100],
      },

      '& .mention': {
        backgroundColor: theme.palette.action.focus,
        borderRadius: '0.4rem',
        boxDecorationBreak: 'clone',
        color: theme.palette.primary.main,
        padding: '0.1rem 0.3rem',
        fontWeight: 'bold',

        '&::after': {
          content: '"\\200B"',
        },
      },

      '& ul[data-type="taskList"]': {
        listStyle: 'none',
        padding: 0,
        margin: 0,

        '& li': {
          display: 'flex',
          gap: '0.7rem',
        },

        '& > li > label': {
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          cursor: 'pointer',
        },

        '& > li > div': {
          flex: 1,
        },

        '& ul[data-type="taskList"]': {
          margin: 0,
          verticalAlign: 'top',
        },
      },

      [`& .${editorClasses.content.heading}`]: {},

      [`& .${editorClasses.content.link}`]: {
        color: theme.palette.primary.main,
      },

      [`& .${editorClasses.content.hr}`]: {
        flexShrink: 0,
        borderWidth: 0,
        margin: '2em 0',
        msFlexNegative: 0,
        WebkitFlexShrink: 0,
        borderStyle: 'solid',
        borderBottomWidth: 'thin',
        borderColor: theme.palette.action.disabled,
      },

      [`& .${editorClasses.content.image}`]: {
        width: '100%',
        height: 'auto',
        maxWidth: '100%',
        margin: 'auto auto 1.25em',
      },

      [`& .${editorClasses.content.bulletList}`]: {
        paddingLeft: 16,
        listStyleType: 'disc',
      },
      [`& .${editorClasses.content.orderedList}`]: { paddingLeft: 16 },
      [`& .${editorClasses.content.listItem}`]: {
        lineHeight: 2,
        '& > p': { margin: 0 },
      },

      [`& .${editorClasses.content.blockquote}`]: {
        lineHeight: 1.5,
        fontSize: '1.5em',
        margin: '24px auto',
        position: 'relative',
        fontFamily: 'Georgia, serif',
        padding: theme.spacing(3, 3, 3, 8),
        color: theme.palette.text.secondary,
        borderLeft: `solid 8px ${theme.palette.grey[300]}`,
        [theme.breakpoints.up('md')]: { width: '100%', maxWidth: 640 },
        '& p': { margin: 0, fontSize: 'inherit', fontFamily: 'inherit' },
        '&::before': {
          left: 16,
          top: -8,
          display: 'block',
          fontSize: '3em',
          content: '"\\201C"',
          position: 'absolute',
          color: theme.palette.text.disabled,
        },
      },


      [`& .${editorClasses.content.codeInline}`]: {
        padding: theme.spacing(0.25, 0.5),
        color: theme.palette.text.secondary,
        fontSize: theme.typography.body2.fontSize,
        borderRadius: theme.shape.borderRadius / 2,
        backgroundColor: theme.palette.grey[200],
      },

      [`& .${editorClasses.content.codeBlock}`]: {
        position: 'relative',
        '& pre': {
          overflowX: 'auto',
          color: theme.palette.common.white,
          padding: theme.spacing(5, 3, 3, 3),
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.grey[900],
          fontFamily: "'JetBrainsMono', monospace",
          '& code': { fontSize: theme.typography.body2.fontSize },
        },
        [`& .${editorClasses.content.langSelect}`]: {
          top: 8,
          right: 8,
          zIndex: 1,
          padding: 4,
          outline: 'none',
          borderRadius: 4,
          position: 'absolute',
          color: theme.palette.common.white,
          fontWeight: theme.typography.fontWeightMedium,
          borderColor: theme.palette.action.disabled,
          backgroundColor: theme.palette.grey[700],
        },
      },
    },
  },
}));
