//Jacks feature (do not touch! ;)
const emojiCodes = [0x1f604, 0x1f602, 0x1f60d, 0x1f60e, 0x1f525, 0x1f680]

const selectEl = document.querySelector("#emojis");
selectEl.classList.add("emojisSelect");

const defaultOption = document.createElement("option")
defaultOption.value = ""
defaultOption.textContent = String.fromCodePoint(0x1f604)
defaultOption.disabled = true
defaultOption.selected = true

selectEl.appendChild(defaultOption)

emojiCodes.forEach(code => {
    const option = document.createElement('option')
    option.value = String.fromCodePoint(code)
    option.textContent = String.fromCodePoint(code)
    selectEl.appendChild(option)
})

const message = document.querySelector("#messageInput");

selectEl.addEventListener('change', () => {
    const emoji = selectEl.value
    if (!emoji) return

    const start = message.selectionStart
    const end = message.selectionEnd
    const text = message.value

    if (Array.from(message.value).length >= message.maxLength) return

    message.value = text.slice(0, start) + emoji + text.slice(end)

    message.focus()
    message.selectionStart = message.selectionEnd = start + emoji.length
    message.dispatchEvent(new Event('input'))
})