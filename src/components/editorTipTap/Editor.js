import { common, createLowlight } from 'lowlight';
import PropTypes from 'prop-types';
import LinkExtension from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import ImageExtension from '@tiptap/extension-image';
import StarterKitExtension from '@tiptap/starter-kit';
import TextAlignExtension from '@tiptap/extension-text-align';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import { useMemo, useState, useEffect, useCallback } from 'react';
import CodeBlockLowlightExtension from '@tiptap/extension-code-block-lowlight';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import FontFamily from '@tiptap/extension-font-family';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import FormHelperText from '@mui/material/FormHelperText';
import useSuggession from './components/useSuggession'
import customMention from './customMention'

import { Toolbar } from './toolbar';
import { EditorRoot } from './styles';
import { editorClasses } from './classes';
import { CodeHighlightBlock } from './components/code-highlight-block';

// ----------------------------------------------------------------------

export function Editor({
  sx,
  ref,
  error,
  onChange,
  slotProps,
  helperText,
  resetValue,
  className,
  editable = true,
  allowMention = false,
  fullItem = true,
  value: content = '',
  placeholder = 'Write here...',
  ...other
}) {
  const suggestion = useSuggession()
  const [fullScreen, setFullScreen] = useState(false);

  const handleToggleFullScreen = useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  const lowlight = useMemo(() => createLowlight(common), []);

  const editor = useEditor({
    content,
    editable,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle, // required for Color and FontFamily
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      FontFamily,
      Superscript,
      Subscript,
      ...(allowMention
        ? [
          customMention.configure({
            HTMLAttributes: {
              class: 'mention',
            },
            suggestion,
          }),
        ]
        : []),
      StarterKitExtension.configure({
        codeBlock: false,
        code: { HTMLAttributes: { class: editorClasses.content.codeInline } },
        heading: { HTMLAttributes: { class: editorClasses.content.heading } },
        horizontalRule: { HTMLAttributes: { class: editorClasses.content.hr } },
        listItem: { HTMLAttributes: { class: editorClasses.content.listItem } },
        blockquote: {
          HTMLAttributes: { class: editorClasses.content.blockquote },
        },
        bulletList: {
          HTMLAttributes: { class: editorClasses.content.bulletList },
        },
        orderedList: {
          HTMLAttributes: { class: editorClasses.content.orderedList },
        },
      }),
      PlaceholderExtension.configure({
        placeholder,
        emptyEditorClass: editorClasses.content.placeholder,
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: editorClasses.content.image },
      }),
      TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
      LinkExtension.configure({
        autolink: true,
        openOnClick: false,
        HTMLAttributes: { class: editorClasses.content.link },
      }),
      CodeBlockLowlightExtension.extend({
        addNodeView: () => ReactNodeViewRenderer(CodeHighlightBlock),
      }).configure({
        lowlight,
        HTMLAttributes: { class: editorClasses.content.codeBlock },
      }),
    ],
    onUpdate({ editor: _editor }) {
      const html = _editor.getHTML();
      onChange?.(html);
    },
    ...other,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editor?.isEmpty && content !== '<p></p>') {
        editor.commands.setContent(content);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [content, editor]);

  useEffect(() => {
    if (resetValue && !content) {
      editor?.commands.clearContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    document.body.style.overflow = fullScreen ? 'hidden' : '';
  }, [fullScreen]);

  return (
    <Portal disablePortal={!fullScreen}>
      {fullScreen && <Backdrop open sx={[(theme) => ({ zIndex: theme.zIndex.modal - 1 })]} />}

      <Box
        {...slotProps?.wrapper}
        sx={[
          {
            display: 'flex',
            flexDirection: 'column',
            ...(!editable && { cursor: 'not-allowed' }),
          },
          ...(Array.isArray(slotProps?.wrapper?.sx)
            ? slotProps.wrapper.sx
            : [slotProps?.wrapper?.sx]),
        ]}
      >
        <EditorRoot
          error={!!error}
          disabled={!editable}
          fullScreen={fullScreen}
          className={[editorClasses.root, className]?.filter(Boolean)?.join(' ')}
          sx={sx}
        >
          <Toolbar
            editor={editor}
            fullItem={fullItem}
            fullScreen={fullScreen}
            onToggleFullScreen={handleToggleFullScreen}
          />
          <EditorContent
            ref={ref}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            editor={editor}
            className={editorClasses.content.root}
          />
        </EditorRoot>

        {helperText && (
          <FormHelperText error={!!error} sx={{ px: 2 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </Portal>
  );
}


Editor.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  ref: PropTypes.any,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  slotProps: PropTypes.shape({
    wrapper: PropTypes.shape({
      sx: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
      ]),
    }),
  }),
  helperText: PropTypes.node,
  resetValue: PropTypes.bool,
  className: PropTypes.string,
  editable: PropTypes.bool,
  allowMention: PropTypes.bool,
  fullItem: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
};
