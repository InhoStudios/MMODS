
let counter = 0;
let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function encode(input) {
    if (input === 0) {
        return alphabet[0] + alphabet[0];
    }

    let encodedString = ""
    let base = alphabet.length;
    while (input) {
        let index = input % base;
        input = Math.floor(input / base);
        encodedString = `${alphabet[index]}${encodedString}`;
    }

    if (encodedString.length === 1) {
        encodedString = "0" + encodedString;
    }

    return encodedString;
}

function id() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    let formattedMonth = month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    let formattedDay = day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    let formattedCounter = encode(Math.floor(counter / 2));
    
    return `${year.toLocaleString('en-US').substring(3)}${formattedMonth}${formattedDay}${formattedCounter}`
}

function tick() {
    counter += 1;
    return counter
}

module.exports = {
    id: id,
    tick: tick
};