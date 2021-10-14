const { validator, number, required } = require("./validator");

var model = {};
let conf = {
    name: {  required: "name required" },
    lastname: {  required: "last name required" },
    age: {  
        number: "age must be a number",
        dummy: {
            msg: "Cannot travel!",
            handler: (message) => (value, values) => {
                console.log(values.hasPassport);
                console.log(value);
                return !value && !values.hasPassport ? message : null;
            }
        } 
    },
};

const setUpModel = (name, lastname, age, hasPassport) => ({
    name: name,
    lastname: lastname,
    age: age,
    hasPassport: hasPassport
});

beforeEach(() => {
    model = setUpModel("Yunior", "Laureano", 28, true);
});

const _validator = validator({ required: required, number: number });

describe("validating each field emptyness", () => {
    test('name is empty', () => {
        model = setUpModel("", "Laureano", 28, false);
        const result = _validator.validate(conf, model);    
        expect(result.hasError).toBe(true)
    })

    test('lastname is empty', () => {
        model = setUpModel("Yunior", "", 28, false);
        const result = _validator.validate(conf, model);    
        expect(result.hasError).toBe(true)
    })

    test('age is empty', () => {
        model = setUpModel("Yunior", "Laureano", null, false);
        const result = _validator.validate(conf, model);    
        expect(result.hasError).toBe(true)
    })
})

test('all fields are empty', () => {
    model = setUpModel("", "", 0, false);
    const result = _validator.validate(conf, model);    
    expect(result.hasError).toBe(true)
})

test('dot not have passport neighther', () => {
    model = setUpModel("Yunior", "Laureano", 0, false);
    const result = _validator.validate(conf, model);    
    expect(result.hasError).toBe(true)
})

test("all fields are valids", () => {
    const result = _validator.validate(conf, model);    
    expect(result.hasError).toBe(false);
});