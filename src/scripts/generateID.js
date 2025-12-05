const letters = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";

export function getRandom(charSet) {
    return charSet[Math.floor(Math.random() * charSet.length)];
}

export function generateID() {
    let p1 = getRandom(letters);
    let p2 = getRandom(numbers);
    let p3 = getRandom(numbers);
    let p4 = getRandom(letters);

    let p5 = getRandom(numbers);
    let p6 = getRandom(letters);
    let p7 = getRandom(letters);
    let p8 = getRandom(numbers);

    const fullID = `${p1}${p2}${p3}${p4}-${p5}${p6}${p7}${p8}`;

    return fullID;
}