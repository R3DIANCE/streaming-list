export function setsetting(setting, state) {
    localStorage.setItem(setting, state)
}

export function getsetting(setting) {
    if (!localStorage.getItem(setting)) {
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
    console.log(localStorage.getItem(setting))
    setsetting(setting, !getboolean(getsetting(setting)))
    return
}

export default {
    setsetting,
    getsetting,
    getboolean,
    togglesetting
}