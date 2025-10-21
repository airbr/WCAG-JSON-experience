"use strict";

function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function findObjectByValue(obj, targetValue) {
    if (Array.isArray(obj)) {
        for (const item of obj) {
            const result = findObjectByValue(item, targetValue);
            if (result) return result;
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value === targetValue) return obj;
                const result = findObjectByValue(value, targetValue);
                if (result) return result;
            }
        }
    }
    return null;
}

function choosePrinciple(index) {
    fetch('/js/wcag.json')
        .then(response => response.json())
        .then(data => {
            console.log(data.principles[index]);

            document.getElementById("output").innerHTML =
                `
        <div class="principle-text">${data.principles[index].content}</div>
        <hr>
        <button class="button" data-button-variant="primary" onclick=(getGuideline(${index}))>Get a guideline</button>
        `
        })
        .catch(error => console.error('Error loading data:', error));
}

function getGuideline(index) {
    fetch('/js/wcag.json')
        .then(response => response.json())
        .then(data => {
            console.log(data.principles[index].guidelines);
            const guideline = getRandomItem(data.principles[index].guidelines);

            const successcriteria = guideline.successcriteria;
            let buttonlist = ``;

            for (const sc of successcriteria) {
                buttonlist += `
                <li>
                    <button onclick="getCriteria('${sc.num}')"class="button" data-button-variant="positive" data-button-radius="hard" >${sc.num}</button>
                </li>
            `;
            }

            document.getElementById("output").innerHTML =
                `
        <h2>Guideline</h2>
        <div class="principle-text">${guideline.content}</div>
        <ul class="cluster">
        ${buttonlist}
        </ul>
        `
        })
        .catch(error => console.error('Error loading data:', error));
}

function getCriteria(num) {
    fetch('/js/wcag.json')
        .then(response => response.json())
        .then(data => {

            const sc = findObjectByValue(data, num);

            console.log(sc);

            document.getElementById("output").innerHTML =
            `
            <div class="principle-text">${sc.content}</div>
            `
        })
        .catch(error => console.error('Error loading data:', error));
}