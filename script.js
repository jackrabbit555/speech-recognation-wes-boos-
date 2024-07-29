



window.SpeechRecognitionAlternative = window.SpeechRecognitionAlternative ||
    window.webkitSpeechRecognition;


let container = document.querySelector('.container');
let p = document.createElement('p');
p.setAttribute('contenteditable', 'true');
let span = document.createElement('span');


const recognition = new SpeechRecognitionAlternative();
recognition.lang = 'fa-IR';
recognition.interimResults = true;
recognition.start();
recognition.addEventListener('end', recognition.start)
recognition.addEventListener('result', (event) => {



    container.appendChild(p);
    let transcript = Array.from(event.results)
        .map((result) => {
            return result[0]
        })
        .map((result) => {
            return result.transcript
        })
        .join(" ");


    if (transcript.includes('علامت سوال')) {
        transcript = transcript.replace('علامت سوال', '?');

    }

    if (transcript.includes('خط بعدی') && event.results[0].isFinal) {


        transcript = '';
        p.setAttribute('contenteditable', 'true');

        p = document.createElement('p');
        container.appendChild(p);

    }

    if (transcript.includes('صفحه پاک شود') && event.results[0].isFinal) {

        container.innerHTML = '';
        p.innerHTML = '';

    }


    if (event.results[0].isFinal) {
        span = document.createElement('span');
        p.appendChild(span);
    }

    if (transcript.includes('صفحه نارنجی')) {
        transcript = '';
        document.body.classList.add('orange');

    }

    if (transcript.includes('صفحه آبی')) {
        
        transcript = '';
        document.body.classList.add('blue')
    }
    if (transcript.includes('صفحه خاکستری')) {
        transcript='',
        document.body.classList.add('gray')
        
    }

    if (transcript.includes('انگلیسی تایپ کن') && event.results[0].isFinal) {
        recognition.stop();
        recognition.lang = 'en-US'
        transcript = '';
        p.setAttribute('contenteditable', 'true');

        p = document.createElement('p');
        p.setAttribute('dir', 'lre');
        container.appendChild(p);
    }

    if (transcript.includes('type in Persian') && event.results[0].isFinal) {
        recognition.stop();
        recognition.lang = 'fa-IR';
        transcript = '';
        p.setAttribute('contenteditable', 'true');

        p = document.createElement('p');
        p.setAttribute('dir', 'ltr');
        container.appendChild(p);
    }


    span.textContent = transcript + " ";
    p.appendChild(span);




    console.log(transcript);



})



