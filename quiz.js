let questions = [];
let currentQuestion = 0;
let partier = {};

let scores = {
    sockerBra: 0,
    gronsakerBra: 0,
    KonspirationerBra: 0,
    motKonspirationer: 0
};

async function startQuiz() {
    const qres = await fetch("questions.json");
    questions = await qres.json();

    const pres = await fetch("partier.json");
    partier = await pres.json();

    currentQuestion = 0;

    showQuestion();
}

function showQuestion() {
    const quizDiv = document.getElementById("quiz");
    const q = questions[currentQuestion];

    let html = `<h3>${q.question}</h3>`;

    q.answers.forEach((a, i) => {
        html += `<button onclick="answer(${i})">${a.text}</button><br><br>`;
    });

    quizDiv.innerHTML = html;
}

function answer(index) {
    const answer = questions[currentQuestion].answers[index];

    for (let key in answer.scores) {
        scores[key] += answer.scores[key];
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function findClosestParty() {

    let bestParty = null;
    let bestDistance = Infinity;

    for (let key in partier) {

        let party = partier[key];
        let distance = 0;

        for (let axis in scores) {

            let userValue = scores[axis] || 0;
            let partyValue = party.values[axis] || 0;

            distance += Math.pow(userValue - partyValue, 2);
        }

        distance = Math.sqrt(distance);

        if (distance < bestDistance) {
            bestDistance = distance;
            bestParty = key;
        }

    }

    return bestParty;
}

function showResult() {

    const resultDiv = document.getElementById("result");

    let best = findClosestParty();
    let party = partier[best];

    resultDiv.innerHTML = `
    <h2>Your closest match: ${party.name}</h2>
    <p>${party.description}</p>
  `;
}
