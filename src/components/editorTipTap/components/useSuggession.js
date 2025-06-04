import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { useAuthContext } from '../../../auth/useAuthContext'
import MentionList from './MentionList'

export default function useSuggession() {
    const { userContacts } = useAuthContext()

    return {
        char: '@',
        items: ({ query }) => {
            const q = query?.toLowerCase()
            const contacts = Array.isArray(userContacts) ? userContacts : []
            const result = contacts?.filter(contact => {
                const firstName = contact.firstName?.toLowerCase() || ''
                const lastName = contact.lastName?.toLowerCase() || ''
                const email = contact.email?.toLowerCase() || ''
                return (
                    firstName.startsWith(q) ||
                    lastName.startsWith(q) ||
                    `${firstName} ${lastName}`.startsWith(q) ||
                    email.startsWith(q)
                )
            }).sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
            return result
        },
        render: () => {
            let component
            let popup

            return {
                onStart: (props) => {
                    component = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                    })

                    if (!props.clientRect) {
                        return
                    }

                    popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                    })
                },

                onUpdate(props) {
                    component.updateProps(props)

                    if (!props.clientRect) {
                        return
                    }

                    popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
                    })
                },

                onKeyDown(props) {
                    if (props.event.key === 'Escape') {
                        popup[0].hide()
                        return true
                    }

                    return component.ref?.onKeyDown(props)
                },

                onExit() {
                    popup[0].destroy()
                    component.destroy()
                },
            }
        },
    }
}
