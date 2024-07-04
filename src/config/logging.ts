import { LogColors } from "./enums"

const getDate = () => new Date().toLocaleString()

const success = (namespace: string, message: string, object = '') => {
    console.log(LogColors.GREEN_LOG, `[${getDate()}] [SUCCESS] [${namespace}] ${message}`, object)
}

const info = (namespace: string, message: string, object = '') => {
    console.log(LogColors.CYAN_LOG, `[${getDate()}] [INFO] [${namespace}] ${message}`, object)
}

const warn = (namespace: string, message: string, object = '') => {
    console.warn(LogColors.YELLOW_LOG, `[${getDate()}] [WARN] [${namespace}] ${message}`, object)
}

const danger = (namespace: string, message: string, object = '') => {
    console.warn(LogColors.RED_LOG, `[${getDate()}] [DANGER] [${namespace}] ${message}`, object)
}

const debug = (namespace: string, message: string, object = '') => {
    console.debug(LogColors.YELLOW_LOG, `[${getDate()}] [DEBUG] [${namespace}] ${message}`, object)
}

export default {
    success,
    info,
    warn,
    danger,
    debug
}
