/* Copyright 2019 Tagurit Studios.
   Email me: codymims2@gmail.com */
var font;
const swears = ["this", "is", "where", "the", "words", "you", "want", "to", "style", "go", "these", "are", "safe", "for", "github"];

chrome.storage.sync.get({
    font: 'cic-bedfort'
}, function (items) {
    font = items.font;
    replaceSwearSpan();
});

const replaceSwearSpan = (() => {
    return function replaceSwearNodesWithSpans() {
        var swearTextNodes = getDescendantTextNodes(document.body);
        for (var i = 0; i < swearTextNodes.length; i++) {
            if (typeof swearTextNodes[i] !== "undefined") {
                var v = swearTextNodes[i].nodeValue;
                var length = swears.length;
                const thisParent = swearTextNodes[i].parentElement;
                var thisChild = swearTextNodes[i];
                while (length--) {
                    const index = v.toLowerCase().indexOf(swears[length]);
                    if (index != -1) {
                        const beforeSwearSpan = document.createElement('span');
                        const swearSpan = document.createElement('span');
                        const afterSwearSpan = document.createElement('span');
                        if (length < 2) { //the first this many words in the swear array are "master" swears that mark any word they're contained in a swear
                            const swearIndex = swearTextNodes[i].textContent.lastIndexOf(" ", index) + 1;
                            const spaceIndex = swearTextNodes[i].textContent.indexOf(" ", index);
                            const emDashIndex = swearTextNodes[i].textContent.indexOf("—", index);
                            var afterSwearIndex;
                            if (spaceIndex == -1 || emDashIndex == -1) {
                                afterSwearIndex = spaceIndex > emDashIndex ? spaceIndex : emDashIndex;
                            } else {
                                afterSwearIndex = spaceIndex < emDashIndex ? spaceIndex : emDashIndex;
                            }
                            beforeSwearSpan.textContent = swearIndex == 0 ? "" : swearTextNodes[i].textContent.substring(0, swearIndex);
                            swearSpan.textContent = afterSwearIndex == -1 ? swearTextNodes[i].textContent.substring(swearIndex) : swearTextNodes[i].textContent.substring(swearIndex, afterSwearIndex);
                            afterSwearSpan.textContent = afterSwearIndex == -1 ? "" : swearTextNodes[i].textContent.substring(afterSwearIndex);
                        } else {
                            if (!isLetter(swearTextNodes[i].textContent.charAt(index - 1)) && !isLetter(swearTextNodes[i].textContent.charAt(index + swears[length].length))) {
                                beforeSwearSpan.textContent = swearTextNodes[i].textContent.substring(0, index);
                                if (["'", ".", "!", ";", ",", "?", "*"].indexOf(swearTextNodes[i].textContent.charAt(index + swears[length].length)) > -1) {
                                    swearSpan.textContent = swearTextNodes[i].textContent.substring(index, index + swears[length].length + 1);
                                    afterSwearSpan.textContent = swearTextNodes[i].textContent.substring(index + swears[length].length + 1);
                                } else {
                                    swearSpan.textContent = swearTextNodes[i].textContent.substring(index, index + swears[length].length);
                                    afterSwearSpan.textContent = swearTextNodes[i].textContent.substring(index + swears[length].length);
                                }
                            } else {
                                continue;
                            }
                        }
                        swearSpan.classList.add(font);
                        thisParent.replaceChild(beforeSwearSpan, thisChild);
                        thisChild = beforeSwearSpan;
                        thisParent.insertBefore(swearSpan, beforeSwearSpan.nextSibling);
                        thisParent.insertBefore(afterSwearSpan, swearSpan.nextSibling);
                        swearTextNodes.push(beforeSwearSpan.childNodes[0]);
                        swearTextNodes.push(afterSwearSpan.childNodes[0]);
                        break;
                    }
                }
            }
        }
    }
})();

function getDescendantTextNodes(elm) {
    return Array.from(elm.querySelectorAll('*:not(script):not(noscript):not(style)'))
        .reduce((textNodes, parentElement) => {
            return Array.from(parentElement.childNodes)
                .filter(childNode => childNode.nodeType === 3)
                .concat(textNodes);
        }, []);
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}