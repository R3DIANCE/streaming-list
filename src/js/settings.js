export function setsetting(setting, state) {
    localStorage.setItem(setting, state)
}

export function getsetting(setting) {
    if (localStorage.getItem(setting) === null) {
        localStorage.setItem(setting, true)
    }
    return localStorage.getItem(setting)
}

export function getboolean(string) {
    if (string === "true") {
        return true
    } else {
        return false
    }
    
}

export function togglesetting(setting) {
    setsetting(setting, !getboolean(getsetting(setting)))
    return
}

const exports = {
    setsetting,
    getsetting,
    getboolean,
    togglesetting
}

export default exports