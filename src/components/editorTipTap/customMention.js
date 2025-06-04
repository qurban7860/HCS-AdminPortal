import { Mention as BaseMention } from '@tiptap/extension-mention'

const customMention = BaseMention.extend({
    addAttributes() {
        return {
            id: {},
            label: {},
            email: {},
        }
    },

    renderHTML({ node, HTMLAttributes }) {
        return ['span', { ...HTMLAttributes, class: 'mention', 'data-email': node.attrs.email }, node.attrs.label || '']
    },
})

export default customMention
