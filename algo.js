

// an algorithm to shift a string by a particlar index
function caeserCipher(string, shift) {
    const alphabetArr = "abcdefghijklmnopqrstuvwxyz".split("")
    let result = ""
    for (let i = 0; i < string.length; i++) {
        const currentChar = string[i]
        const idx = alphabetArr.indexOf(currentChar)
        if (idx === -1) {
            result += currentChar
            continue;
        }

        const encodedIdx = (idx + shift) % 26
        res += alphabetArr[encodedIdx]

    }

    return res
}
