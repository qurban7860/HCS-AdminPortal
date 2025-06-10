import { Mention } from '@tiptap/extension-mention';

const customMention = Mention.extend({
    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('id'),
                renderHTML: attributes => ({ id: attributes.id }),
            },
            label: {
                default: null,
                parseHTML: element => element.getAttribute('label'),
                renderHTML: attributes => ({ label: attributes.label }),
            },
            email: {
                default: null,
                parseHTML: element => element.getAttribute('email') || element.getAttribute('data-email'),
                renderHTML: attributes => ({
                    email: attributes.email,
                    'data-email': attributes.email,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span.mention',
                getAttrs: element => ({
                    id: element.getAttribute('id'),
                    label: element.getAttribute('label'),
                    email: element.getAttribute('email') || element.getAttribute('data-email'),
                }),
            },
        ];
    },

    renderHTML({ node }) {
        return [
            'span',
            {
                class: 'mention',
                id: node.attrs.id,
                label: node.attrs.label,
                email: node.attrs.email,
                'data-email': node.attrs.email,
            },
            node.attrs.label || '@mention',
        ];
    },
});


export default customMention
