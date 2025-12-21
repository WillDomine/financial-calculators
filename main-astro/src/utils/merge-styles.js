function merge_styles(...inputs) {
    return inputs.filter(Boolean).join(' ')
}

export { merge_styles }