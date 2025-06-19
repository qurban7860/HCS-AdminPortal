import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, } from '@mui/material';
import { ToolbarItem } from './toolbar-item';
import { toolbarIcons } from '../icons';

TableMenu.propTypes = {
    editor: PropTypes.shape({
        isActive: PropTypes.func,
        chain: PropTypes.func,
        can: PropTypes.func,
    })
};

export function TableMenu({ editor }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <ToolbarItem
                aria-label="Table"
                tooltip="Table"
                onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                onMouseLeave={() => setTimeout(() => setAnchorEl(null), 300)}
                icon={toolbarIcons.table}
            />

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    onMouseEnter: () => clearTimeout(),
                    onMouseLeave: () => setTimeout(() => setAnchorEl(null), 300),
                }}
            >
                <ToolbarItem
                    aria-label="Insert Table"
                    tooltip="Insert Table"
                    onClick={() =>
                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                    icon={toolbarIcons.newtable}
                />
                <ToolbarItem
                    aria-label="Delete Table"
                    tooltip="Delete Table"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    icon={toolbarIcons.deleteTable}
                />

                {/* Row Actions */}
                <ToolbarItem
                    aria-label="Add Row Before"
                    tooltip="Add Row Before"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    icon={toolbarIcons.addRowBefore}
                />
                <ToolbarItem
                    aria-label="Add Row After"
                    tooltip="Add Row After"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    icon={toolbarIcons.addRowAfter}
                />
                <ToolbarItem
                    aria-label="Delete Row"
                    tooltip="Delete Row"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    icon={toolbarIcons.deleteRow}
                />

                {/* Column Actions */}
                <ToolbarItem
                    aria-label="Add Column Before"
                    tooltip="Add Column Before"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    icon={toolbarIcons.addColumnBefore}
                />
                <ToolbarItem
                    aria-label="Add Column After"
                    tooltip="Add Column After"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    icon={toolbarIcons.addColumnAfter}
                />
                <ToolbarItem
                    aria-label="Delete Column"
                    tooltip="Delete Column"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    icon={toolbarIcons.deleteColumn}
                />

                {/* Cell Actions */}
                <ToolbarItem
                    aria-label="Merge Cells"
                    tooltip="Merge Cells"
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    icon={toolbarIcons.mergeCells}
                />
                <ToolbarItem
                    aria-label="Split Cell"
                    tooltip="Split Cell"
                    onClick={() => editor.chain().focus().splitCell().run()}
                    icon={toolbarIcons.splitCell}
                />
            </Menu>
        </>
    );
}
