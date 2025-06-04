import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { toolbarIcons } from './icons';
import { editorClasses } from './classes';
import { LinkBlock } from './components/link-block';
import { ImageBlock } from './components/image-block';
import { ToolbarItem } from './components/toolbar-item';
import { HeadingBlock } from './components/heading-block';
import { TableMenu } from './components/TableMenu';

// ----------------------------------------------------------------------

export function Toolbar({ sx, editor, fullItem, fullScreen, onToggleFullScreen, ...other }) {
  if (!editor) {
    return null;
  }

  const boxStyles = {
    gap: 0.5,
    display: 'flex',
  };

  return (
    <Stack
      className={editorClasses.toolbar.root}
      divider={<Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />}
      sx={[
        (theme) => ({
          gap: 1,
          p: 1.25,
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
          borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <HeadingBlock editor={editor} />

      {/* Text style */}
      <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Bold"
          tooltip="Bold"
          active={editor.isActive('bold')}
          className={editorClasses.toolbar.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={toolbarIcons.bold}
        />
        <ToolbarItem
          aria-label="Italic"
          tooltip="Italic"
          active={editor.isActive('italic')}
          className={editorClasses.toolbar.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={toolbarIcons.italic}
        />
        <ToolbarItem
          aria-label="Underline"
          tooltip="Underline"
          active={editor.isActive('underline')}
          className={editorClasses.toolbar.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={toolbarIcons.underline}
        />
        <ToolbarItem
          aria-label="Strike"
          tooltip="Strike"
          active={editor.isActive('strike')}
          className={editorClasses.toolbar.italic}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={toolbarIcons.strike}
        />
      </Box>

      {/* Text decorations (superscript, subscript, highlight) */}
      <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Superscript"
          tooltip="Super Script"
          active={editor.isActive('superscript')}
          className={editorClasses.toolbar.superscript}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          icon={toolbarIcons.superscript}
        />
        <ToolbarItem
          aria-label="Subscript"
          tooltip="Sub Script"
          active={editor.isActive('subscript')}
          className={editorClasses.toolbar.subscript}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          icon={toolbarIcons.subscript}
        />
      </Box>

      {/* Font color / background color */}
      {/* <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Font Color"
          tooltip="Font Color"
          className={editorClasses.toolbar.fontColor}
          onClick={() => editor.chain().focus().setColor('#ff0000').run()} // Replace with color picker later
          icon={toolbarIcons.fontColor}
        />
        <ToolbarItem
          aria-label="Background Color"
          tooltip="Background Color"
          className={editorClasses.toolbar.bgColor}
          onClick={() => editor.chain().focus().setHighlight({ color: '#ffff00' }).run()} // Replace with color picker later
          icon={toolbarIcons.bgColor}
        />
      </Box> */}

      {/* Font family */}
      {/* <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Font Family"
          tooltip="Font Family"
          className={editorClasses.toolbar.fontFamily}
          onClick={() => editor.chain().focus().setFontFamily('serif').run()} // Later bind to dropdown
          icon={toolbarIcons.fontFamily}
        />
      </Box> */}

      {/* Table actions */}
      {/* <Box sx={{ ...boxStyles }}>
        <TableMenu editor={editor} />
      </Box> */}
      {/* List */}
      <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Task List"
          tooltip="Task List"
          active={editor.isActive('taskList')}
          className={editor.isActive('taskList') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          icon={toolbarIcons.taskList}
        />

        <ToolbarItem
          aria-label="Bullet list"
          tooltip="Bullet list"
          active={editor.isActive('bulletList')}
          className={editorClasses.toolbar.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={toolbarIcons.bulletList}
        />

        <ToolbarItem
          aria-label="Ordered list"
          tooltip="Ordered list"
          active={editor.isActive('orderedList')}
          className={editorClasses.toolbar.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={toolbarIcons.orderedList}
        />
      </Box>

      {/* Text align */}
      <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Align left"
          tooltip="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          className={editorClasses.toolbar.alignLeft}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          icon={toolbarIcons.alignLeft}
        />
        <ToolbarItem
          aria-label="Align center"
          tooltip="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          className={editorClasses.toolbar.alignCenter}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          icon={toolbarIcons.alignCenter}
        />
        <ToolbarItem
          aria-label="Align right"
          tooltip="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          className={editorClasses.toolbar.alignRight}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          icon={toolbarIcons.alignRight}
        />
        <ToolbarItem
          aria-label="Align justify"
          tooltip="Align justify"
          active={editor.isActive({ textAlign: 'justify' })}
          className={editorClasses.toolbar.alignJustify}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          icon={toolbarIcons.alignJustify}
        />
      </Box>

      {/* Code - Code block */}
      {fullItem && (
        <Box sx={{ ...boxStyles }}>
          <ToolbarItem
            aria-label="Code"
            tooltip="Code"
            active={editor.isActive('code')}
            className={editorClasses.toolbar.code}
            onClick={() => editor.chain().focus().toggleCode().run()}
            icon={toolbarIcons.code}
          />
          <ToolbarItem
            aria-label="Code block"
            tooltip="Code block"
            active={editor.isActive('codeBlock')}
            className={editorClasses.toolbar.codeBlock}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={toolbarIcons.codeBlock}
          />
        </Box>
      )}

      {/* Blockquote - Hr line */}
      {fullItem && (
        <Box sx={{ ...boxStyles }}>
          <ToolbarItem
            aria-label="Blockquote"
            tooltip="Block Quote"
            active={editor.isActive('blockquote')}
            className={editorClasses.toolbar.blockquote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={toolbarIcons.blockquote}
          />
          <ToolbarItem
            aria-label="Horizontal"
            tooltip="Horizontal"
            className={editorClasses.toolbar.hr}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={toolbarIcons.horizontal}
          />
        </Box>
      )}

      {/* Link - Image */}
      <Box sx={{ ...boxStyles }}>
        <LinkBlock
          editor={editor}
          icons={{
            link: toolbarIcons.link,
            unsetLink: toolbarIcons.unsetLink,
          }}
        />
        <ImageBlock editor={editor} icon={toolbarIcons.image} />
      </Box>

      {/* HardBreak - Clear */}
      <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="HardBreak"
          tooltip="HardBreak"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={editorClasses.toolbar.hardbreak}
          icon={toolbarIcons.hardbreak}
        />
        <ToolbarItem
          aria-label="Clear"
          tooltip="Clear"
          className={editorClasses.toolbar.clear}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          icon={toolbarIcons.clear}
        />
      </Box>

      {/* Undo - Redo */}
      {fullItem && (
        <Box sx={{ ...boxStyles }}>
          <ToolbarItem
            aria-label="Undo"
            tooltip="Undo"
            className={editorClasses.toolbar.undo}
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
            icon={toolbarIcons.undo}
          />
          <ToolbarItem
            aria-label="Redo"
            tooltip="Redo"
            className={editorClasses.toolbar.redo}
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
            icon={toolbarIcons.redo}
          />
        </Box>
      )}

      <Box sx={{ ...boxStyles }}>
        <ToolbarItem
          aria-label="Fullscreen"
          tooltip="Fullscreen"
          active={fullScreen}
          className={editorClasses.toolbar.fullscreen}
          onClick={onToggleFullScreen}
          icon={fullScreen ? toolbarIcons.fullScreen : toolbarIcons.exitFullScreen}
        />
      </Box>
    </Stack>
  );
}

Toolbar.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  editor: PropTypes.shape({
    isActive: PropTypes.func,
    chain: PropTypes.func,
    can: PropTypes.func,
  }),
  fullItem: PropTypes.bool,
  fullScreen: PropTypes.bool,
  onToggleFullScreen: PropTypes.func,
};
