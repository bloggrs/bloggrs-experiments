
const yup = require("yup");

module.exports = {
    param_id: yup.string().test(val => !val || !isNaN(Number(val)))
}