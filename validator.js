const required = (message) => (value) => {
    if(!value) {
        return message
    }
    return null
}

const number = (message) => (value) => {
    if(isNaN(value)) {
        return message
    }
    return null
}

const validator = (fns) => {  
    
    const normalizeFunc = (validateConfig) => {
        let normalizedFunc = {}
        const confKeys = Object.keys(validateConfig)
    
        for (let i = 0; i < confKeys.length; i++) {
            
            if(!normalizedFunc[confKeys[i]]) {
                normalizedFunc[confKeys[i]] = []
            }
            
            let funcKeys = Object.keys(validateConfig[confKeys[i]])
            for (let j = 0; j < funcKeys.length; j++) {
                let message = null;
                let handler = null;
                let rule = validateConfig[confKeys[i]][funcKeys[j]];

                if((typeof rule) == "string") {
                    message = rule
                    handler = fns[funcKeys[j]]
                } else {
                    message = rule.msg
                    handler = rule.handler || fns[funcKeys[j]]
                }
                normalizedFunc[confKeys[i]].push(handler(message));              
            }              
        }
        return normalizedFunc;
    }
    
    const validate = (validateConfig, values) => {
    
        let normalizedConf = normalizeFunc(validateConfig);    
        let validated = {}
        let fields = Object.keys(normalizedConf);
    
        for (let i = 0; i < fields.length; i++) {
            const funcs = normalizedConf[fields[i]];
            validated[fields[i]] = funcs.map(func => {
                return func(values[fields[i]], values)
            }).filter(msg => msg != null)
        }
        
        return {
            errors: validated,
            hasError: (Object.keys(validated).filter(vf => validated[vf].length > 0)).length > 0
        };
    }

    return {
        validate: validate
    }
}

module.exports = {
    required,
    number,
    validator
}