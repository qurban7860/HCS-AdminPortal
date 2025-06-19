export const getMentionEmails = (editor) => {
    const content = editor.getJSON()
    const emails = new Set()

    const extract = (node) => {
        if (node.type === 'mention' && node.attrs?.email) {
            emails.add(node.attrs.email)
        }

        if (node.content) {
            node.content.forEach(extract)
        }
    }

    extract(content)
    return Array.from(emails)
}
