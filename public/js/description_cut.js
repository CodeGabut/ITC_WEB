let teks1 = "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer. Ini merupakan"


console.log(teks1.length);


console.log(teks1.slice(0,teks1.length)+"...");

function cutDescription(text) {
    return text.slice(0,28)+"..."
}
