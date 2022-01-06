import * as Tone from "tone";

// $0.dispatchEvent(new PointerEvent('pointerdown'))

let b1 = document.querySelector("#b1");
const synth = new Tone.Synth().toDestination();

document.body.addEventListener("pointerdown", (e) => {
    // trigger the attack immediately
    synth.triggerAttack("C4", "+0");
    alert(888)
    console.log("pointerdown:" + Date.now());
    
    // wait one second before triggering the release
    synth.triggerRelease("+0.5");
});

// b1.addEventListener('click',(e)=>{
//     console.log('click:'+Date.now())
// })

// console.log('start pointerdown at:'+Date.now());
// b1.dispatchEvent(new PointerEvent('pointerdown'))

// console.log('start click at:'+Date.now());
// b1.dispatchEvent(new PointerEvent('click'))
