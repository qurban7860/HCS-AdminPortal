
import React from 'react';
import PropTypes from 'prop-types';

ColorMenu.propTypes = {
    editor: PropTypes.shape({
        isActive: PropTypes.func,
        chain: PropTypes.func,
        can: PropTypes.func,
    }),
    type: PropTypes.string,
};

const COLORS = [
    '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
    '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb',
    '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888',
    '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444',
    '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466',
];

export function ColorMenu({ editor, type = 'text' }) {
    if (!editor) return null;

    const handleClick = (color: string) => {
        if (type === 'text') {
            editor.chain().focus().setColor(color).run();
        } else {
            editor.chain().focus().setHighlight({ color }).run();
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                padding: 4,
                maxWidth: 180,
            }}
        >
            {COLORS.map((color, i) => (
                <button
                    key={i}
                    onClick={() => handleClick(color)}
                    style={{
                        width: 20,
                        height: 20,
                        border: '1px solid #ccc',
                        borderRadius: 3,
                        backgroundColor: color,
                        cursor: 'pointer',
                    }}
                    aria-label={color}
                    title={color}
                />
            ))}
        </div>
    );
}
