"use strict";
// Test for a start
document.getElementById('output').focus();
loadFromParams();

// Initial load from Params
// If URL Param, do something
// This is messy and needs clean up
function loadFromParams(){
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (params.has('num')) {
        const numparam = params.get('num').length;
        if (numparam === (1 || 2)) {
            choosePrinciple(Number(params.get('num')) - 1);
        }
        if (numparam === (3 || 4)) {
            getGuideline(params.get('num'), params.get('num').toString());
        }
        if (numparam === (5 || 6)) {
            getCriteria(params.get('num').toString());
        }
    }
}

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

            const guidelines = data.principles[index].guidelines;
            let guidebuttonlist = ``;
            for (const guide of guidelines) {
                guidebuttonlist += `
            <li>
                <button onclick="getGuideline(${index}, ${guide.num.toString()})" class="button" data-button-variant="positive" data-button-radius="hard" >${guide.handle}</button>
            </li>
        `;
            }

        document.getElementById("breadcrumb").innerHTML =
        `  
        <ol>
            <li><a href="/">Start</a></li>
            <li aria-current="page">${data.principles[index].handle}</li>
        </ol>
        `            
        document.getElementById("output").innerHTML = principlestate =
        `
        <h1 id="journey">${data.principles[index].num} Principle: ${data.principles[index].handle}</h1>
        <strong>${data.principles[index].content}</strong>
        <p>Choose a Guideline:</p>
        <ul class="cluster">
        <button class="button" data-button-variant="primary" onclick="getGuideline(${index}, ${false})">Get a Random Guideline</button>
        ${guidebuttonlist}
        </ul>
        `
            let num = index + 1;
            const url = new URL(location);
            url.searchParams.set('num', num);
            history.pushState({ num: num }, "", url);
            document.getElementById('output').focus();
        })
        .catch(error => console.error('Error loading data:', error))
}

function getGuideline(index, specific = false) {
    fetch('js/wcag.json')
        .then(response => response.json())
        .then(data => {
            let guideline;
            let principle;
            if (specific != false) {
                guideline = findObjectByValue(data, specific.toString());
                principle = findObjectByValue(data, specific.toString().slice(0, -2));
            } else {
                guideline = getRandomItem(data.principles[index].guidelines);
                principle = findObjectByValue(data, guideline.num.toString().slice(0, -2));
            }
            const successcriteria = guideline.successcriteria;
            let buttonlist = ``;
            for (const sc of successcriteria) {
                buttonlist += `
            <li>
                <button onclick="getCriteria('${sc.num}')"class="button" data-button-variant="positive" data-button-radius="hard" >${sc.handle}</button>
            </li>
        `;
            }
        document.getElementById("breadcrumb").innerHTML =
        `  
        <ol>
            <li><a href="/">Start</a></li>
            <li><a href="/?num=${principle.num}">${principle.handle}</a></li>
            <li aria-current="page">${guideline.handle}</li>
        </ol>
        `
        document.getElementById("output").innerHTML = guidelinestate =
        `
        <h1 id="journey">${guideline.num} Guideline: ${guideline.handle}</h1>
        <strong>${guideline.content}</strong>
        <p>Get a criteria for success:</p>
        <ul class="cluster">
        ${buttonlist}
        </ul>
        `
            const url = new URL(location);
            url.searchParams.set('num', guideline.num);
            history.pushState({ num: guideline.num }, "", url);
            document.getElementById('output').focus();
        })
        .catch(error => console.error('Error loading data:', error));
}

function getCriteria(num) {
    fetch('js/wcag.json')
        .then(response => response.json())
        .then(data => {
            const sc = findObjectByValue(data, num);
            let principle;
            let guideline;
            if (num.length === 6) {
                guideline = findObjectByValue(data, num.slice(0, -3));
                principle = findObjectByValue(data, num.slice(0, -5));
            } else {
                guideline = findObjectByValue(data, num.slice(0, -2));
                principle = findObjectByValue(data, num.slice(0, -4)); 
            }
            let sufficientbuttonlist = ``;
            let advisorybuttonlist = ``;
            let failurebuttonlist = ``;
            if (sc.techniques.sufficient) {
                for (const sufficient of sc.techniques.sufficient) {
                    if (sufficient.techniques) {
                        sufficientbuttonlist += `
                        <li>
                            <h2>${sufficient.title}</h2>
                        </li>`;
                        for (const tech of sufficient.techniques) {
                            if (tech.and) {
                                sufficientbuttonlist += `
                                <li>
                                    <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${tech.and[0].technology}/${tech.and[0].id}" data-button-variant="ghost" data-button-radius="hard">${tech.and[0].title}</a>
                                </li>
                                <li class="and-text"><strong>AND</strong></li>
                                <li>
                                    <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${tech.and[1].technology}/${tech.and[1].id}" data-button-variant="ghost" data-button-radius="hard">${tech.and[1].title}</a>
                                </li>
                                `;
                            } else {
                                if (tech.title && !tech.technology && !tech.id) {
                                // Redundant
                                } else {
                                sufficientbuttonlist += `
                                <li>
                                    <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${tech.technology}/${tech.id}" data-button-variant="ghost" data-button-radius="hard">${tech.title}</a>
                                </li>`;
                                }        
                            }
                        }
                        if (sufficient.groups) {
                            for (const group of sufficient.groups) {
                                sufficientbuttonlist += `
                            <li>
                                <h2>${group.title}</h2>
                            </li>`
                                for (const grouptechniques of group.techniques) {
                                    sufficientbuttonlist +=
                                    `<li>
                                      <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${grouptechniques.technology}/${grouptechniques.id}" data-button-variant="ghost" data-button-radius="hard">${grouptechniques.title}</a>
                                     </li>`;
                                }
                            }
                        }
                    } else if (sufficient.using) {
                        sufficientbuttonlist += `
                        <li>
                            <h2>${sufficient.title}</h2>
                        </li>`;
                        for (const using of sufficient.using) {
                            sufficientbuttonlist += `
                        <li>
                            <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${using.technology}/${using.id}" data-button-variant="ghost" data-button-radius="hard">${using.title}</a>
                        </li>`;
                        }
                    } else if (!sufficient.technology && !sufficient.id) {
                        sufficientbuttonlist += `
                    <li>
                        <p>${sufficient.title}</p>
                    </li>
                    `
                    } else {
                        sufficientbuttonlist += `
                    <li>
                        <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${sufficient.technology}/${sufficient.id}" data-button-variant="ghost" data-button-radius="hard">${sufficient.title}</a>
                    </li>`;
                    }
                }
            }
            if (sc.techniques.advisory) {
                for (const advisory of sc.techniques.advisory) {
                if (advisory.and) {
                advisorybuttonlist +=          
                `
                    <li>
                        <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${advisory.and[0].technology}/${advisory.and[0].id}" data-button-variant="ghost" data-button-radius="hard">${advisory.and[0].title}</a>
                    </li>
                    <li class="and-text"><strong>AND</strong></li>
                    <li>
                        <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${advisory.and[1].technology}/${advisory.and[1].id}" data-button-variant="ghost" data-button-radius="hard">${advisory.and[1].title}</a>
                    </li>
                `;
                } else {
                advisorybuttonlist +=          
                `
                    <li>
                        <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${advisory.technology}/${advisory.id}" data-button-variant="ghost" data-ghost-button>${advisory.title}</a>
                    </li>
                `;
                }
                }
            }
            if (sc.techniques.failure) {
                for (const failure of sc.techniques.failure) {
                    if (failure.title && !failure.technology && !failure.id) {
                        failurebuttonlist += `
                        <li>
                            <a class="button" data-button-variant="negative" data-button-radius="hard" >${failure.title}</a>
                        </li>
                        `;
                    } else {
                        failurebuttonlist += `
                        <li>
                            <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${failure.technology}/${failure.id}" data-button-variant="negative" data-button-radius="hard" >${failure.title}</a>
                        </li>
                        `;
                    }
                }   
            }

            document.getElementById("breadcrumb").innerHTML =
            `            
            <ol>
                 <li><a href="/">Start</a></li>
                 <li><a href="/?num=${principle.num}">${principle.handle}</a></li>
                 <li><a href="/?num=${guideline.num}">${guideline.handle}</a></li>
                 <li aria-current="page">${sc.handle}</li>
            </ol>
            `
            document.getElementById("output").innerHTML = successcriteriastate =
            ` 
            <h1 id="journey"> ${sc.num} <a href="https://www.w3.org/WAI/WCAG22/quickref/#${sc.id}">Success Criterion Quick Reference</a></h1>
            <h2><a href="https://www.w3.org/WAI/WCAG22/understanding/${sc.id}">How to understand  "${sc.id}" criterion</a></h2>
            ${sc.content}
            <h2>Sufficient Techniques</h2>
            <ul class="cluster">
             ${sufficientbuttonlist}
            </ul>
            <h2>Advisory Techniques</h2>
            <ul class="cluster">
             ${advisorybuttonlist ? advisorybuttonlist : '<li>None</li>'}
            </ul>
            <h2>Failure Techniques</h2>
            <ul class="cluster">
            ${failurebuttonlist ? failurebuttonlist : '<li>None</li>'}
            </ul>
            `
            const url = new URL(location);
            url.searchParams.set('num', sc.num);
            history.pushState({ num: sc.num }, "", url);
            document.getElementById('output').focus();
        })
        .catch(error => console.error('Error loading data:', error));
}