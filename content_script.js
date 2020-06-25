/*Copyright 2019-2020 Tagurit Studios.
  Email me: codymims2@gmail.com*/
  const SWEARS = {
    REGULAR: ["this", "is", "where", "the", "words", "you", "want", "to", "style", "go"],
    //any word containing a dominant swear will be marked as a swear
    DOMINANT: ["these", "are", "safe", "for", "github"]
};
const PUNCTUATION_TO_STYLE = [".", "…", "!", ";", ",", "?", "*"];
chrome.storage.sync.get({
    font: "cic-bedfort"
}, function ({ font }) {
    let textNodes = Array.from(document.body.querySelectorAll("*:not(script):not(noscript):not(style)")).reduce((textNodes, parentElement) => Array.from(parentElement.childNodes).filter(childNode => childNode.nodeType === 3).concat(textNodes), []);
    for (let textNode of textNodes) {
        if (typeof textNode === 'object') {
            let parent = textNode.parentElement;
            swearIteration:
            for (let swearType of Object.getOwnPropertyNames(SWEARS)) {
                for (let swear of SWEARS[swearType]) {
                    let swearIndex = textNode.textContent.toLowerCase().indexOf(swear);
                    if (swearIndex !== -1) {
                        let beforeSwearSpan = document.createElement("span");
                        let swearSpan = document.createElement("span");
                        let afterSwearSpan = document.createElement("span");
                        let swearEndIndex = swearIndex + swear.length;
                        if (swearType === "DOMINANT") {
                            while (isLetter(textNode.textContent.charAt(swearIndex - 1))) {
                                swearIndex--;
                            }
                            while (isLetter(textNode.textContent.charAt(swearEndIndex))) {
                                swearEndIndex++;
                            }
                        } else if (isLetter(textNode.textContent.charAt(swearIndex - 1)) || isLetter(textNode.textContent.charAt(swearEndIndex))) {
                            continue;
                        }
                        if (PUNCTUATION_TO_STYLE.indexOf(textNode.textContent.charAt(swearEndIndex)) !== -1) {
                            swearEndIndex++;
                        }
                        beforeSwearSpan.textContent = textNode.textContent.substring(0, swearIndex);
                        swearSpan.textContent = textNode.textContent.substring(swearIndex, swearEndIndex);
                        afterSwearSpan.textContent = textNode.textContent.substring(swearEndIndex);
                        swearSpan.classList.add(font);
                        parent.replaceChild(beforeSwearSpan, textNode);
                        parent.insertBefore(swearSpan, beforeSwearSpan.nextSibling);
                        parent.insertBefore(afterSwearSpan, swearSpan.nextSibling);
                        textNodes.push(beforeSwearSpan.childNodes[0]);
                        textNodes.push(afterSwearSpan.childNodes[0]);
                        break swearIteration;
                    }
                }
            }
        }
    }
});

function isLetter(str) {
    return str.match(/[a-z]/i);
}