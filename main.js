import * as Tone from "tone";
let sampler;

const PIANO_PARAs = {
    rows: 3,
    cols: 5,
    start: 4,
    volumeStep: 6,
};
let menuModel = {
    fullscreen: {
        cnname: "全屏",
    },
    changeInstrument: {
        cnname: "乐器选择",
    },
    increaseVolume: {
        cnname: "增大音量",
    },
};
let insSamplerOptionsList = {
    default: {
        cnname: "默认钢琴",
        urls: {
            C4: "c4.mp3",
            C5: "c5.mp3",
            C6: "c6.mp3",
            "D#4":"ds4.mp3",
            "D#5":"ds5.mp3",
            "F#4": "fs4.mp3",
            "F#5": "fs5.mp3",
            "A4": "a4.mp3",
            "A5": "a5.mp3"
            
        },
        baseUrl: "./salamander/",
    },
    salamander: {
        cnname: "钢琴1",
        urls: {
            C4: "c4.mp3",
            C5: "c5.mp3",
            C6: "c6.mp3",
            "D#4":"ds4.mp3",
            "D#5":"ds5.mp3",
            "F#4": "fs4.mp3",
            "F#5": "fs5.mp3",
            "A4": "a4.mp3",
            "A5": "a5.mp3"
            
        },
        baseUrl: "./salamander/",
    },
    upright: {
        cnname: "钢琴2",
        urls: {
            C4: "C4vL.wav",
            C5: "C5vL.wav",
            C6: "C6vL.wav",
            "F#4": "Fs4vL.wav",
            "F#5": "Fs5vL.wav",
        },
        baseUrl: "./upright/",
    },
    honkeytank: {
        cnname: "酒吧钢琴",
        urls: {
            C4: "C4.wav",
            C5: "C5.wav",
            G4: "G4.wav",
            G5: "G5.wav",
        },
        baseUrl: "./honkeytank/",
    },
    clarinet: {
        cnname: "单簧",
        urls: {
            D4: "D4.wav",
            D5: "D5.wav",
        },
        baseUrl: "./clarinet/",
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
    voice: {
        cnname: "岁岁",
        urls: {
            C4: "hen2.mp3",
        },
        baseUrl: "./voice/",
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
    key.classList.add('pianokey');
    key.id=note;
    key.style.backgroundImage = 'url("./svgs/square.svg")';
    ifCircleKey && (key.style.backgroundImage = 'url("./svgs/circle.svg")');

    noteName === "c" &&
        (key.style.backgroundImage = 'url("./svgs/circle_in_square.svg")');

    // key.innerText=note;
    
    return key;
}

document.addEventListener('pointerover',(e)=>{
    let elm=e.target;
    if(elm.classList.contains('pianokey')){
        console.log(elm.id);
        let note=elm.id;
        sampler.triggerAttack(note, "+0", 1);
    }
})
document.addEventListener("pointerout", (e) => {
    let elm=e.target;
    if(elm.classList.contains('pianokey')){
        console.log(elm.id);
        let note=elm.id;
        sampler.triggerRelease(note, "+0.7");
    };
});

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
        let model = new PianoModel(rows, cols, start);
        let view = new PianoView(document.querySelector("#app"), model.keyRows);
        document
            .querySelector("#instrumentListContainer")
            .appendChild(createInstrumentListElm());
    });
}

let toogleFullScreenElem = document.querySelector("#togglefs");
let chInstrumentElem = document.querySelector("#chinstrument");
let increaseVoluemElm = document.querySelector("#increasevol");

toogleFullScreenElem.addEventListener("click", (e) => {
    toggleFullScreen();
});
increaseVoluemElm.addEventListener("click", (e) => {
    sampler.volume.value += PIANO_PARAs.volumeStep;
    alert("音量已增加");
});

chInstrumentElem.addEventListener("click", (e) => {
    document.querySelector("#instrumentListContainer").hidden = false;
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

init(3, 5, 4, insSamplerOptionsList.default);
