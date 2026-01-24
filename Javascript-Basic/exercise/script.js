// 1. Select the first div
const firstDiv = document.querySelector('div');

// 2. Select all paragraphs
const allParagraphs = document.querySelectorAll('p');

// 3. Select the last div
const allDivs = document.querySelectorAll('div');
const lastDiv = allDivs[allDivs.length - 1];

// 4. Select the header 3 in the last div
const header3InLastDiv = lastDiv.querySelector('h3');

// 5. Select the header 1 in the last div
const header1InLastDiv = lastDiv.querySelector('h1');

// 6. Get the text from the first paragraph in the second div
const allDivsArray = Array.from(document.querySelectorAll('div'));
const secondDiv = allDivsArray[1];
const textFromFirstParagraphInSecondDiv = secondDiv.querySelector('p').textContent;

// 7. Add the word "text" to the text element in the second div
// Assuming you want to add "text" to the first text node or element
const textElementInSecondDiv = secondDiv.querySelector('p, span, div, h1, h2, h3, h4, h5, h6') || secondDiv;
textElementInSecondDiv.textContent += " text";

// 8. Change the text of the header 1 in the last div
if (header1InLastDiv) {
    header1InLastDiv.textContent = "New Header 1 Text";
}

// 9. Change the text of the header 3 in the last div
if (header3InLastDiv) {
    header3InLastDiv.textContent = "New Header 3 Text";
}

// Console log to show results
console.log("1. First div:", firstDiv);
console.log("2. All paragraphs:", allParagraphs);
console.log("3. Last div:", lastDiv);
console.log("4. Header 3 in last div:", header3InLastDiv);
console.log("5. Header 1 in last div:", header1InLastDiv);
console.log("6. Text from first paragraph in second div:", textFromFirstParagraphInSecondDiv);