import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const database = getDatabase(app);

/* =========================
MENYU
========================= */

const menuButton = document.querySelector(".menu-btn");
const closeButton = document.querySelector(".close-menu");
const sideMenu = document.querySelector(".side-menu");

if (menuButton && sideMenu) {
menuButton.addEventListener("click", () => {
sideMenu.classList.add("active");
});
}

if (closeButton && sideMenu) {
closeButton.addEventListener("click", () => {
sideMenu.classList.remove("active");
});
}

/* =========================
GOOGLE LOGIN
========================= */

const googleLogin = document.getElementById("googleLogin");
const loginStatus = document.getElementById("loginStatus");

if (googleLogin) {

googleLogin.addEventListener("click", async () => {

    googleLogin.disabled = true;
    googleLogin.textContent = "GİRİŞ EDİLİR...";

    try {

        const result = await signInWithPopup(
            auth,
            googleProvider
        );

        const user = result.user;

        console.log("Google giriş uğurlu:", user);

        if (loginStatus) {
            loginStatus.textContent =
                "Daxil oldunuz: " + user.email;
        }

        googleLogin.textContent = "✓ GOOGLE İLƏ DAXİL OLDU";

    } catch (error) {

        console.error("Google Login Error:", error);

        googleLogin.disabled = false;
        googleLogin.textContent = "GOOGLE İLƏ DAXİL OL";

        if (error.code === "auth/popup-closed-by-user") {
            alert("Google giriş pəncərəsi bağlandı.");
        } else {
            alert(
                "Google ilə giriş alınmadı.\n\n" +
                error.code
            );
        }

    }

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
document.getElementById("answer6")
];

/* UC düyməsi */

if (freeText && quizOverlay) {

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

        if (!input) return;

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


    /* Google hesabı ilə giriş olub-olmadığını yoxla */

    if (!auth.currentUser) {

        alert("Əvvəlcə Google ilə daxil olun!");

        return;
    }


    const cavablar = {

        oyuncuID: answers[0].value.trim(),
        oyuncuIsmi: answers[1].value.trim(),
        ucMiqdari: answers[2].value.trim(),
        eposta: answers[3].value.trim(),
        sual6: answers[4].value.trim(),

        googleEmail: auth.currentUser.email,
        googleUID: auth.currentUser.uid,

        tarix: new Date().toISOString()

    };


    try {

        await push(
            ref(database, "uc-cavablar"),
            cavablar
        );

        alert("Cavablar uğurla göndərildi!");

        quizOverlay.classList.remove("active");

        document.body.style.overflow = "";


        answers.forEach((input) => {

            if (input) {
                input.value = "";
                input.style.borderColor = "#c5c5c5";
            }

        });

    } catch (error) {

        console.error(error);

        alert(
            "Cavab göndərilmədi. Firebase Database qaydalarını yoxla."
        );

    }

});

}

/* =========================
İMTİNA
========================= */

if (cancelQuiz && quizOverlay) {

cancelQuiz.addEventListener("click", () => {

    const exit = confirm(
        "İmtina etsəniz səhifədən çıxacaqsınız. Davam etmək istəyirsiniz?"
    );

    if (exit) {

        quizOverlay.classList.remove("active");

        document.body.style.overflow = "";

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
