class Jugador {
    #nombre;
    #puntaje;
    #respuestasCorrectas;

    constructor(nombre) {
        this.nombre = nombre;
        this.#puntaje = 0;
        this.#respuestasCorrectas = 0;
    }

    get nombre() {
        return this.#nombre
    }

    set nombre(value) {
        this.#nombre = value
    }

    get puntaje() {
        return `Tienes ${this.#puntaje}`
    }

    set puntaje(value) {
        this.#puntaje = value
    }

    get respuestasCorrectas() {
        return this.#puntaje
    }

    set respuestasCorrectas(value) {
        this.#respuestasCorrectas = value
    }

    sumarPuntos(puntos) {
        this.puntaje = this.puntaje + puntos
    }

    aumentarCorrectas() {
        this.respuestasCorrectas = this.respuestasCorrectas + 1
    }

    //Principio solid

    reiniciar() {
        this.nombre = ''
        this.respuestasCorrectas = 0
        this.puntaje = 0
    }
}


class Pregunta {
    #texto; //esto sera una pregunta
    #opciones; //esto un arreglo de opciones
    #respuestaCorrecta; //aqui ira la respuesta correcta a la pregunta
    #puntos;

    constructor(texto, opciones, respuestaCorrecta, puntos) {
        this.texto = texto;
        this.opciones = opciones;
        this.respuestaCorrecta = respuestaCorrecta;
        this.puntos = puntos
    }


    get texto() {
        return this.#texto
    }

    set texto(value) {
        this.#texto = value
    }

    get opciones() {
        return this.#opciones
    }

    set opciones(value) {

        if (Array.isArray(value)) {
            this.#opciones = value
        } else {
            throw new Error('No se aceptan valores distintos de un array')
        }
    }

    get respuestaCorrecta() {
        return this.#respuestaCorrecta
    }

    set respuestaCorrecta(value) {
        this.#respuestaCorrecta = value
    }

    get puntos() {
        return this.#puntos
    }

    set puntos(value) {
        this.#puntos = value
    }

    validarRespuesta(respuesta) {
        return respuesta == this.#respuestaCorrecta //esto dice: si la respuesta dentro de parentesis es igual a this.#respuestaCorrecta, entonces, devolvera true. De lo contrario, retornara false
    }
}

class Quiz {
    #preguntas;
    #preguntaActual;
    #jugador;
    #indice;


    constructor(preguntas, preguntaActual, jugador) {
        this.preguntas = preguntas;
        this.jugador = jugador
        this.#indice = 0
    }

    get preguntas() {
        return this.#preguntas
    }

    set preguntas(value) {
        this.#preguntas = value
    }

    get preguntaActual() {
        return this.#preguntaActual
    }

    set preguntaActual(value) {
        this.#preguntaActual = value
    }

    get jugador() {
        return this.#jugador
    }

    set jugador(value) {
        this.#jugador = value
    }

    iniciar() {
        this.preguntaActual = this.preguntas[0];
    }

    mostrarPregunta() {
        return this.preguntaActual
    }

    responder(respuesta) {
        //este metodos nos va a ayudar a capturar las respuestas del usuario
        let res = this.preguntaActual.validarRespuesta(respuesta);
        if (res) {
            this.jugador.aumentarCorrectas()
            this.jugador.sumarPuntos(this.preguntaActual.puntos)
        }
    }

    siguientePregunta() {
        this.#indice++;
        this.preguntaActual = this.preguntas[this.#indice];
        //        return this.preguntas[this.#indice]
    }

    finalizarQuiz() {
        if (this.#indice == this.preguntas.length - 1) {
            //se acabo
            return `Se termino el quiz, podra ver sus resultado a continuacion`
        } else {
            return `No ha terminado el quiz aun`
        }
    }
}

let formInicio = document.querySelector('#form-iniciar');

let pantalla1 = document.querySelector('#pantalla-inicio');
let pantalla2 = document.querySelector('#pantalla-quiz');

let estadoJugador = document.querySelector('#estado-jugador');
let estadoPuntaje = document.querySelector('#estado-puntaje');
let estadoCorrectas = document.querySelector('#estado-correctas');

let preguntaVisual = document.querySelector('#texto-pregunta')
let respuestasVsual = document.querySelector('#opciones-respuesta')

const pregunta1 = new Pregunta('Cual es mi edad?', ['10', '20', '30', '40'], '30', 10)
const pregunta2 = new Pregunta('Cual es mi sueldo?', ['10', '20', '30', '40'], '10', 10)
const pregunta3 = new Pregunta('Cual es mi mercado?', ['10', '20', '30', '40'], '20', 10)
const pregunta4 = new Pregunta('Cual es mi fecha de nacimiento?', ['10', '20', '30', '40'], '30', 10)
const pregunta5 = new Pregunta('Cual es mi comida fav?', ['10', '20', '30', '40'], '40', 10)

const ArregloDePreguntas = [pregunta1, pregunta2, pregunta3, pregunta4, pregunta5]

let feedbackRespuesta = document.querySelector('#feedback-respuesta')



formInicio.addEventListener('submit', (event) => {
    event.preventDefault();
    let playerOne = new Jugador(event.target['nombre-jugador'].value);
    const QuizOne = new Quiz(ArregloDePreguntas, playerOne);
    QuizOne.iniciar();


    console.log(playerOne);
    pantalla1.classList.add('d-none')
    pantalla2.classList.remove('d-none')

    estadoJugador.textContent = `Jugador: ${playerOne.nombre}`
    estadoPuntaje.textContent = playerOne.puntaje
    estadoCorrectas.textContent = `Correctas: ${playerOne.respuestasCorrectas}`

    preguntaVisual.textContent = QuizOne.preguntaActual.texto


    QuizOne.preguntaActual.opciones.forEach(element => {
        let btnRespuesta = document.createElement('button')
        btnRespuesta.className = 'btn btn-outline-primary text-start py-3'
        btnRespuesta.textContent = element
        respuestasVsual.append(btnRespuesta)

    });

    respuestasVsual.addEventListener('click', (event) => {
        event.target.classList.add('active')

        let esCorrecta = QuizOne.preguntaActual.validarRespuesta(event.target.textContent)

        feedbackRespuesta.textContent = `Su respuesta es ${ esCorrecta ? 'correcta' : 'incorrecta'}`
        if(!esCorrecta){
            feedbackRespuesta.classList.remove('alert-success');
            feedbackRespuesta.classList.add('alert-danger')
        }

        feedbackRespuesta.classList.remove('d-none')


        QuizOne.responder(event.target.textContent)

    })
});