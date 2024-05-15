const tokeiUrl = "https://tokei.nightly.pw";
const playerContId = "lb-player-cont";
const lbContainer = document.getElementById(playerContId);

const lbPlayerLimit = 35;

const buttonToTrackedArea = new Map();
buttonToTrackedArea.set("exodus-lb", "Exodus");
buttonToTrackedArea.set("spaceadv-lb", "Space Advanced");
buttonToTrackedArea.set("infernus-lb", "Infernus");
buttonToTrackedArea.set("inferno-lb", "Inferno");
buttonToTrackedArea.set("nightmare-lb", "Nightmare");

function clearLbContainer() {
    lbContainer.textContent = '';
}

function addParagraphToLb(text, ...classes) {
    const p = document.createElement('p');
    p.textContent = text;
    if (classes.length > 0)
        p.classList.add(classes);
    lbContainer.appendChild(p);
}

function loadAreaLeaderboards(area) {
    fetch(tokeiUrl + "/api/leaderboard/completion?area=" + area).catch((err) => {
        console.log(err);
        clearLbContainer();
        addParagraphToLb("Failed to load tokei leaderboard.");
    }).then((resp) => {
        return resp.json();
    }).then((data) => {
        if (!data.placements)
            return;
        clearLbContainer();
        let playersAdded = 0;
        for (let player of data.placements) {
            if (playersAdded >= lbPlayerLimit)
                return;

            let localDate = new Date(player.dateReached);
            // Localize the date from UTC
            localDate = new Date(localDate - localDate.getTimezoneOffset() * 60000);
            playersAdded++;
            addParagraphToLb(`#${playersAdded} ${player.playerName} | ${player.areaReached} | ${localDate.toLocaleString()}`, "normal-placement");
        }
    });
}

for (let [button, areaName] of buttonToTrackedArea) {
    document.getElementById(button).addEventListener('click', () => {
        loadAreaLeaderboards(areaName);
    });
}

loadAreaLeaderboards("Exodus");