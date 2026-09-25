import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getDatabase,
    ref,
    push
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyBN8edCjP3wLUOVSJzrVoVP6XUj_EMOVII",
    authDomain: "pubgfreeuc-36b26.firebaseapp.com",
    projectId: "pubgfreeuc-36b26",
    storageBucket: "pubgfreeuc-36b26.firebasestorage.app",
    messagingSenderId: "140987527383",
    appId: "1:140987527383:web:9c2505c8f4a36707530092",
    measurementId: "G-LQTCE28GXB"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


/* =========================
   MENYU
========================= */

const menuButton = document.querySelector(".menu-btn");
const closeButton = document.querySelector(".close-menu");
const sideMenu = document.querySelector(".side-menu");

if (menuButton) {
    menuButton.addEventListener("click", () => {
        sideMenu.classList.add("active");
    });
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        sideMenu.classList.remove("active");
    });
}


/* =========================
   UC FORMU
========================= */

const freeText = document.getElementById("freeText");
const quizOverlay = document.getElementById("quizOverlay");

const confirmQuiz = document.getElementById("confirmQuiz");
const cancelQuiz = document.getElementById("cancelQuiz");

const answers = [
    document.getElementById("answer1"),
    document.getElementById("answer2"),
    document.getElementById("answer3"),
    document.getElementById("answer4"),
    document.getElementById("answer5"),
    document.getElementById("answer6")
];


/* UC düyməsi */

if (freeText) {

    freeText.addEventListener("click", () => {

        quizOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    });

}


/* =========================
   TƏSTİQLƏ
========================= */

if (confirmQuiz) {

    confirmQuiz.addEventListener("click", async () => {

        let tamamdir = true;

        answers.forEach((input) => {

            if (input.value.trim() === "") {

                tamamdir = false;
                input.style.borderColor = "#ff3333";

            } else {

                input.style.borderColor = "#c5c5c5";

            }

        });


        if (!tamamdir) {

            alert("Zəhmət olmasa bütün suallara cavab verin!");
            return;

        }


        /* Cavabları hazırlayırıq */

        const cavablar = {

            sual1: answers[0].value.trim(),
            sual2: answers[1].value.trim(),
            sual3: answers[2].value.trim(),
            sual4: answers[3].value.trim(),
            sual5: answers[4].value.trim(),
            sual6: answers[5].value.trim(),

            tarix: new Date().toISOString()

        };


        try {

            /* Firebase Database-ə göndər */

            await push(
                ref(database, "uc-cavablar"),
                cavablar
            );


            alert("Cavablar uğurla göndərildi!");


            quizOverlay.classList.remove("active");

            document.body.style.overflow = "";


            /* Formu təmizlə */

            answers.forEach((input) => {
                input.value = "";
            });


        } catch (error) {

            console.error(error);

            alert(
                "Cavab göndərilmədi. Firebase bağlantısını yoxla."
            );

        }

    });

}


/* =========================
   İMTİNA
========================= */

if (cancelQuiz) {

    cancelQuiz.addEventListener("click", () => {

        const exit = confirm(
            "İmtina etsəniz səhifədən çıxacaqsınız. Davam etmək istəyirsiniz?"
        );

        if (exit) {

            window.location.href = "about:blank";

        }

    });

}


/* =========================
   KƏNARA BASANDA BAĞLANMASIN
========================= */

if (quizOverlay) {

    quizOverlay.addEventListener("click", (event) => {

        if (event.target === quizOverlay) {

            event.stopPropagation();

        }

    });

}