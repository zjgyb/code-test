// 请使用优化以下代码：

// 假设已经存在以下3个函数，3个函数的功能都是向服务器上传文件，根据不同的上传类型参数都会不一样。内容的实现这里无须关注
// 请重新设计一个功能，根据不同文件的后缀名，上传到不同的服务器。
// txt 上传到 ftp
// exe 上传到 sftp
// doc 上传到 http
function uploadByFtp (file: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
}
function uploadBySftp (file: string[], cb: (ret: boolean) => void): void {
    cb(true)
}
function uploadByHttp (file: string): boolean {
    return true
}

export type RuleFunction = (name: string) => string
export type CallbackFunc = (name: string) => Promise<boolean>
export interface RegisterKey {
    key: string
    value: CallbackFunc
}

class UploadActions {
    private uploadMap: Map<string, CallbackFunc>
    private rule: RuleFunction

    constructor() {
        this.uploadMap = new Map()
        // 默认规则，取后缀名
        this.rule = (file: string) => file.match(/\.(\w+)$/)[1]
    }

    getRule() {
        return this.rule
    }

    setRule(rule: RuleFunction) {
        this.rule = rule
    }

    getuploadMap() {
        return this.uploadMap
    }

    register(name: string, callback: CallbackFunc) {
        if (typeof callback !== 'function') {
            console.error(`${callback} is not a function`)
            return
        }
        const sourceCallback = this.uploadMap.get(name)
        if (sourceCallback) {
            console.warn(`${name} is repeat`)
        }
        this.uploadMap.set(name, (name) => callback(name))
    }

    registers(arr: RegisterKey[]) {
        arr.forEach((item) => {
            this.register(item.key, item.value)
        })
    }

    remove(names: string[]) {
        names.forEach((key) => {
            this.uploadMap.delete(key)
        })
    }

    getUploadFunc(files: string[]) {
        return files.reduce((callbackFunc: CallbackFunc[], nextFile: string) => {
            const key = this.rule(nextFile)
            if (!this.uploadMap.has(key)) {
                console.info(`Not allowed to upload ${nextFile}`)
                return callbackFunc
            }
            callbackFunc.push(this.uploadMap.get(key))
            return callbackFunc
        }, [])
    }
}

export const actions = new UploadActions()
actions.register('text', (name: string) => uploadByFtp(name))
actions.register('exe', (name: string) => {
    return new Promise((resolve, reject) => {
        uploadBySftp([name], ret => ret ? resolve(true) : reject())
    })
})
actions.register('doc', (name: string) => Promise.resolve(uploadByHttp(name)))

// 实现如下
export function upload (files: string[]): Promise<boolean> {
    return Promise.all(actions.getUploadFunc(files)).then((values) => {
        values.forEach((isUploadSuccess, index) => {
            if (isUploadSuccess) {
                console.warn(`${files[index]} callback function load failed`)
            }
        })
        return true
    }).catch(error => {
        console.error(error)
        return false
    })
}
