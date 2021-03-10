module.exports = validPW;

function validPW(pw) {
    const reg = /[a-z]+[0-9]+/;
    const reg2 = /[0-9]+[a-z]+/;
    return pw.length > 8 && (reg.test(pw) || reg2.test(pw));
}