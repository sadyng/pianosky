import * as Tone from "tone";
let sampler;

const PIANO_PARAs = {
    rows: 3,
    cols: 5,
    start: 4,
};
let menuModel={
    fullscreen:{
        cnname: "全屏"
    },
    changeInstrument:{
        cnname: "乐器选择"
    },
    increaseVolume:{
        cnname: "增大音量"
    }
}
let insSamplerOptionsList = {
    salamander: {
        cnname: "钢琴1",
        urls: {
            C4: "c4.mp3",
            C5: "c5.mp3",
            C6: "c6.mp3",
        },
        baseUrl: "./salamander/",
    },
    kawai: {
        cnname: "钢琴2",
        urls: {
            C4: "C4.wav",
            C5: "C5.wav",
            C6: "C6.wav",
            F4: "F4.wav",
            F5: "F5.wav",
        },
        baseUrl: "./kawai/",
    },
    guitar: {
        cnname: "吉他",
        urls: {
            C4: "C4.wav",
            C5: "C5.wav",
            C6: "C6.wav",
            F4: "F4.wav",
            F5: "F5.wav",
        },
        baseUrl: "./guitar/",
    },

    ocarina: {
        cnname: "笛",
        urls: {
            C4: "C4.wav",
            E6: "E6.wav",
            A6: "A6.wav",
        },
        baseUrl: "./ocarina/",
    },
};

export class PianoModel {
    constructor(rows, cols, start) {
        this.n_rows = rows;
        this.n_cols = cols;
        this.keyRows = {};
        for (let i = 0; i < rows; i++) {
            this.keyRows[i] = [];
            for (let j = 0; j < cols; j++) {
                this.keyRows[i].push(convertNumToNote(i * cols + j, start));
            }
        }
    }
}

export class PianoView {
    constructor(container, rows, sampler) {
        this.container = container;
        this.container.innerHTML = "";
        for (let i = 0; i < Object.keys(rows).length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                container.appendChild(
                    createKey(rows[i][j], isCircleKey(j), sampler)
                );
            }
            container.appendChild(document.createElement("br"));
        }
    }
}

function convertNumToNote(n, start) {
    let notes = ["c", "d", "e", "f", "g", "a", "b"];
    return notes[n % 7] + (start + Math.floor(n / 7));
}

function createKey(note, ifCircleKey) {
    let noteName = note[0];
    let noteNumber = note[1];
    let key = document.createElement("button");
    key.classList = ["pianokey"];
    key.style.backgroundImage = 'url("./svgs/square.svg")';
    ifCircleKey && (key.style.backgroundImage = 'url("./svgs/circle.svg")');

    noteName === "c" &&
        (key.style.backgroundImage = 'url("./svgs/circle_in_square.svg")');

    // key.innerText=note;
    key.addEventListener("pointerdown", (e) => {
        console.log(note)
        sampler.triggerAttack(note, "+0", 1);
    });
    key.addEventListener("pointerup", (e) => {
        sampler.triggerRelease(note, "+0.5");
    });
    return key;
}

function isCircleKey(n) {
    return n % 2 === 0;
}

function toggleFullScreen() {
    if (
        !document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
    ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
    }
}

function init(rows, cols, start, instrumentInfo) {
    sampler = new Tone.Sampler(instrumentInfo).toDestination();
    Tone.loaded().then(() => {
        sampler.volume.value = 10;
        let model = new PianoModel(rows, cols, start);
        let view = new PianoView(document.querySelector("#app"), model.keyRows);
        document
            .querySelector("#instrumentListContainer")
            .appendChild(createInstrumentListElm());
    });
}

let currentInstrumentInfo = {
    urls: {
        C4: "C4.wav",
        E6: "E6.wav",

        A6: "A6.wav",
    },
    baseUrl: "./ocarina/",
};

let toogleFullScreenElem = document.querySelector("#togglefs");
let chInstrumentElem = document.querySelector("#chinstrument");
let increaseVoluemElm = document.querySelector("#increasevol");

toogleFullScreenElem.addEventListener("click", (e) => {
    toggleFullScreen();
});
increaseVoluemElm.addEventListener("click", (e) => {
    sampler.volume.value+=10;
    alert("音量已增加")
});

chInstrumentElem.addEventListener("click", (e) => {
    document.querySelector('#instrumentListContainer').hidden=false;
});

function createInstrumentListElm() {
    let listElm = document.createElement("ol");
    let allInstrumentsNames = Object.keys(insSamplerOptionsList);
    for (const i of allInstrumentsNames) {
        let li = document.createElement("li");
        li.innerText = insSamplerOptionsList[i].cnname;
        li.style.marginBottom = "30px";
        li.addEventListener("pointerdown", (e) => {
            sampler = new Tone.Sampler(
                insSamplerOptionsList[i]
            ).toDestination();
            document.querySelector("#instrumentListContainer").hidden = true;
        });
        listElm.appendChild(li);
    }
    return listElm;
}

init(3, 5, 4, insSamplerOptionsList.salamander);
