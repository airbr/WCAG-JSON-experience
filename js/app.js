"use strict";

// Test
document.getElementById('output').focus();

window.addEventListener('popstate', function (event) {
    // This will force a full page reload, ignoring cache
    // Temporary Solution TODO: Upgrade
    location.reload(true);
});

// If URL Param, do something
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
if (params.has('num')) {
    const num = params.get('num').toString().length;
    if (num == (1 || 2)) {
        console.log('is Principle');
        choosePrinciple(params.get('num'));
    }
    if (num == (3 || 4)) {
        console.log('is Guideline');
        getGuideline(params.get('num'), params.get('num').toString());
    }
    if (num === 5 || 6) {
        console.log('is SC');
        getCriteria(params.get('num').toString());
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

            document.getElementById("output").innerHTML = principlestate =
                `<h1>${data.principles[index].num}. Principle: ${data.principles[index].handle}</h1>
        ${data.principles[index].content}
        <ul class="cluster">
        <button class="button" data-button-variant="primary" onclick="(getGuideline(${index}, ${false}))">Get a random Guideline</button>
        ${guidebuttonlist}
        </ul>
        `
            const url = new URL(location);
            url.searchParams.set('num', index);
            history.pushState({}, "", url);
            document.getElementById('output').focus();
        })
        .catch(error => console.error('Error loading data:', error))
}

function getGuideline(index, specific = false) {
    fetch('js/wcag.json')
        .then(response => response.json())
        .then(data => {
            let guideline;
            if (specific != false) {
                guideline = findObjectByValue(data, specific.toString());
            } else {
                guideline = getRandomItem(data.principles[index].guidelines);
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
            document.getElementById("output").innerHTML = guidelinestate =
                `
        <h2>${guideline.num}. Guideline: ${guideline.handle}</h2>
        ${guideline.content}
        <ul class="cluster">
        ${buttonlist}
        </ul>
        `
            const url = new URL(location);
            url.searchParams.set('num', guideline.num);
            history.pushState({}, "", url);
            document.getElementById('output').focus();

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
                    if (sufficient.techniques) {
                        sufficientbuttonlist += `
                        <li>
                            <h3>${sufficient.title}</h3>
                        </li>`;
                        if (sufficient.techniques[0].and) {
                            sufficientbuttonlist += `
                            <li>
                                <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${sufficient.techniques[0].and[0].technology}/${sufficient.techniques[0].and[0].id}" data-button-variant="ghost" data-button-radius="hard">${sufficient.techniques[0].and[0].title}</a>
                            </li>
                            <li class="and-text"><strong>AND</strong></li>
                            <li>
                                <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${sufficient.techniques[0].and[1].technology}/${sufficient.techniques[0].and[1].id}" data-button-variant="ghost" data-button-radius="hard">${sufficient.techniques[0].and[1].title}</a>
                            </li>
                            `;
                        } else {
                            for (const moretechniques of sufficient.techniques) {
                                if (moretechniques.title && !moretechniques.technology && !moretechniques.id) {
                                  // Redudant
                                } else {
                                sufficientbuttonlist += `
                                <li>
                                    <a class="button" href="https://www.w3.org/WAI/WCAG22/Techniques/${moretechniques.technology}/${moretechniques.id}" data-button-variant="ghost" data-button-radius="hard">${moretechniques.title}</a>
                                </li>`;
                                }
                            }
                        }
                        if (sufficient.groups) {
                            for (const group of sufficient.groups) {
                                sufficientbuttonlist += `
                            <li>
                                <h3>${group.title}</h3>
                            </li>`
                                for (const grouptechniques of group.techniques) {
                                    console.log(grouptechniques);
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
                            <h3>${sufficient.title}</h3>
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
             ${advisorybuttonlist ? advisorybuttonlist : '<li>None</li>'}
            </ul>
            <h3>Failure Techniques</h3>
            <ul class="cluster">
            ${failurebuttonlist ? failurebuttonlist : '<li>None</li>'}
            </ul>
            `
            const url = new URL(location);
            url.searchParams.set('num', sc.num);
            history.pushState({}, "", url);
            document.getElementById('output').focus();
        })
        .catch(error => console.error('Error loading data:', error));
}