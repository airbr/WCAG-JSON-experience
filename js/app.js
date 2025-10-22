"use strict";


// Really Messy Global State.
var principlestate;
var guidelinestate;
var successcriteriastate;

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
    fetch('js/wcag.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").innerHTML = principlestate =
        `<h1>${data.principles[index].num} Principle</h1>
        <p class="principle-text">${data.principles[index].content}</p>
        <button class="button" data-button-variant="primary" onclick=(getGuideline(${index}))>Get a guideline</button>
        `
        })
        .catch(error => console.error('Error loading data:', error));
}

function getGuideline(index) {
    fetch('js/wcag.json')
        .then(response => response.json())
        .then(data => {
            const guideline = getRandomItem(data.principles[index].guidelines);
            const successcriteria = guideline.successcriteria;
            let buttonlist = ``;
            for (const sc of successcriteria) {
                buttonlist += `
                <li>
                    <button onclick="getCriteria('${sc.num}')"class="button" data-button-variant="positive" data-button-radius="hard" >${sc.handle}</button>
                </li>
            `;
            }
            document.getElementById("output").innerHTML = guidelinestate =
        `
        <h2>${guideline.num} Guideline</h2>
        ${guideline.content}
        <ul class="cluster">
        ${buttonlist}
        </ul>
        <button class="button" data-ghost-button data-button-radius="hard" onclick="loadCrudeState(guidelinestate)" >Back</button>

        `
        })
        .catch(error => console.error('Error loading data:', error));
}

function getCriteria(num) {
    fetch('js/wcag.json')
        .then(response => response.json())
        .then(data => {

            const sc = findObjectByValue(data, num);

            let sufficientbuttonlist = ``;
            let advisorybuttonlist = ``;
            let failurebuttonlist = ``;
            if (sc.techniques.sufficient) {
                for (const sufficient of sc.techniques.sufficient) {
                    if (sufficient.techniques){
                        sufficientbuttonlist += `
                        <li>
                            <h3>${sufficient.title}</h3>
                        </li>`;
                        for (const moretechniques of sufficient.techniques) {
                        sufficientbuttonlist += `
                        <li>
                            <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${moretechniques.technology}/${moretechniques.id}" data-button-variant="ghost" data-button-radius="hard">${moretechniques.title}</a>
                        </li>`;
                        }
                    } else {
                    sufficientbuttonlist += `
                    <li>
                        <button class="button" data-button-variant="ghost" data-button-radius="hard">${sufficient.title}</button>
                    </li>`;
                    }
                }
            }    
           if (sc.techniques.advisory) {
                for (const advisory of sc.techniques.advisory) {
                    advisorybuttonlist += `
                    <li>
                        <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${advisory.technology}/${advisory.id}" data-button-variant="ghost" data-ghost-button>${advisory.title}</a>
                    </li>
                `;
                }
            }
           if (sc.techniques.failure) {
            for (const failure of sc.techniques.failure) {
                failurebuttonlist += `
                <li>
                    <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${failure.technology}/${failure.id}" data-button-variant="negative" data-button-radius="hard" >${failure.title}</a>
                </li>
            `;
            }
           }

            document.getElementById("output").innerHTML = successcriteriastate =
            `
            <h2> ${sc.num} <a href="https://www.w3.org/WAI/WCAG22/quickref/#${sc.id}">Success Criterion</a></h2>
            ${sc.content}
            <h3>Sufficient Techniques</h3>
            <ul class="cluster">
             ${sufficientbuttonlist}
            </ul>
            <h3>Advisory Techniques</h3>
            <ul class="cluster">
             ${advisorybuttonlist ? advisorybuttonlist : 'None'}
            </ul>
            <h3>Failure Techniques</h3>
            <ul class="cluster">
            ${failurebuttonlist ? failurebuttonlist : 'None'}
            </ul>
            <button class="button" data-ghost-button data-button-radius="hard" onclick="loadCrudeState(guidelinestate, true)" >Back</button>
            `
        })
        .catch(error => console.error('Error loading data:', error));
}

function loadCrudeState (state, guideline) {

 if (guideline !== true) {
    let original = 
      `<ul class="cluster" role="list">
        <li>
          <button href="#" onclick="choosePrinciple(0)" class="button">Perceivable</button>
        </li>
        <li>
          <button href="#" onclick="choosePrinciple(1)" class="button">Operable</button>
        </li>
        <li>
          <button href="#" onclick="choosePrinciple(2)" class="button">Understandable</button>
        </li>
        <li>
          <button href="#" onclick="choosePrinciple(3)" class="button">Robust</button>
        </li>
      </ul>`
    document.getElementById("output").innerHTML = original;
 } else {
    document.getElementById("output").innerHTML = state;
 }  
}