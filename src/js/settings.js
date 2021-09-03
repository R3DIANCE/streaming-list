export function setsetting(setting, state) {
    localStorage.setItem(setting, state)
}

export function getsetting(setting) {
    return localStorage.getItem(setting)
}

export function getboolean(string) {
    console.log(string)
    if (string == "true") {
        return true
    } else {
        return false
    }
}

export function togglesetting(setting) {
    setsetting(setting, !getboolean(getsetting(setting)))
    return
}

export function getsettingordefault(setting, defaultvalue) {
    if (getsetting(setting) == null) {
        setsetting(setting, defaultvalue);
        return defaultvalue
    } else {
        const num = getsetting(setting);
        return num
    }
}

export function setnumbersetting(setting, value) {
    setsetting(setting, value);
}

const exports = {
    setsetting,
    getsetting,
    getboolean,
    togglesetting,
    getsettingordefault
}

export default exports