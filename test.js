import * as Tone from 'tone'


let b1=document.querySelector('#b1');
const gainNode = new Tone.Gain(0).toDestination();
gainNode.gain.rampTo(4,3);


const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).connect(gainNode);

Tone.loaded().then(() => {
    b1.addEventListener('click',(e)=>{
        console.log(888)
        sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 1);
        
    })

})

urls: {
    C4: "C4.wav",
    C5: "C5.wav",
    F4: "F4.wav",
    F5: "F5.wav",
    C6: "C6.wav"
},
