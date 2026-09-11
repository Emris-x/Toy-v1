/* =========================================================
   TOY V1 — APPLICATION ARCHITECTURE
   Phase 1.4
   ========================================================= */


/* =========================================================
   1. TOY APPLICATION STATE
   ---------------------------------------------------------
   This object represents what TOY currently knows about
   the child and the current session.

   We will expand this later as the learning system grows.
   ========================================================= */

const TOY = {

    /* ---------- Application ---------- */

    app: {
        name: "TOY",
        version: "1.0.0",
        initialized: false
    },


    /* ---------- Current Screen ---------- */

    screen: {
        current: "boot"
    },


    /* ---------- Child Progress ---------- */

    progress: {
        level: 1,
        stars: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
    },


    /* ---------- Game State ---------- */

    game: {
        active: false,
        currentQuestion: null,
        currentPattern: null,
        difficulty: 1,
        streak: 0
    },


    /* ---------- Audio ---------- */

    audio: {
        soundEnabled: true,
        voiceEnabled: true
    }

};


/* =========================================================
   2. SCREEN REGISTRY
   ---------------------------------------------------------
   Every major TOY screen will eventually be registered here.

   For V1 we start with the boot screen.

   Later:

   boot
   home
   abcLand
   game
   results
   settings
   ========================================================= */

const SCREENS = {

    boot: "boot-screen",

    home: "home-screen",

    abcLand: "abc-land-screen",

    game: "game-screen",

    results: "results-screen",

    settings: "settings-screen"

};


/* =========================================================
   3. DOM CACHE
   ---------------------------------------------------------
   We store important HTML elements here so JavaScript
   doesn't repeatedly search the entire document.
   ========================================================= */

const DOM = {

    app: null,

    screen: null,

    bootScreen: null,

    startButton: null

};


/* =========================================================
   4. DOM INITIALIZATION
   ========================================================= */

function initializeDOM() {

    DOM.app = document.getElementById("app");

    DOM.screen = document.getElementById("screen");

    DOM.bootScreen = document.getElementById(
        SCREENS.boot
    );

    DOM.startButton = document.getElementById(
        "start-button"
    );

}


/* =========================================================
   5. SCREEN MANAGEMENT
   ---------------------------------------------------------
   This will eventually allow TOY to move between:

   Home
      ↓
   ABC Land
      ↓
   Game
      ↓
   Results
   ========================================================= */

function showScreen(screenName) {

    const screenId = SCREENS[screenName];

    if (!screenId) {

        console.warn(
            `TOY: Screen "${screenName}" does not exist.`
        );

        return;
    }


    const screens = document.querySelectorAll(".screen");


    screens.forEach((screen) => {

        screen.hidden = true;

    });


    const targetScreen = document.getElementById(screenId);


    if (!targetScreen) {

        console.warn(
            `TOY: Screen element "${screenId}" was not found.`
        );

        return;
    }


    targetScreen.hidden = false;

    TOY.screen.current = screenName;

}


/* =========================================================
   6. LOCAL STORAGE
   ---------------------------------------------------------
   V1 does not need accounts or a database.

   We will use the child's device/browser for basic progress.

   Later we can replace this with a proper persistence
   system without rewriting the entire application.
   ========================================================= */

const STORAGE_KEY = "toy-v1-state";


function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(TOY)
        );

    } catch (error) {

        console.warn(
            "TOY: Unable to save local progress.",
            error
        );

    }

}


function loadState() {

    try {

        const savedState =
            localStorage.getItem(STORAGE_KEY);


        if (!savedState) {
            return;
        }


        const parsedState =
            JSON.parse(savedState);


        if (parsedState.progress) {

            TOY.progress = {
                ...TOY.progress,
                ...parsedState.progress
            };

        }


        if (parsedState.audio) {

            TOY.audio = {
                ...TOY.audio,
                ...parsedState.audio
            };

        }


    } catch (error) {

        console.warn(
            "TOY: Unable to load saved progress.",
            error
        );

    }

}


/* =========================================================
   7. GAME RESET
   ---------------------------------------------------------
   Used when starting a fresh learning session.
   ========================================================= */

function resetGameSession() {

    TOY.game = {

        active: false,

        currentQuestion: null,

        currentPattern: null,

        difficulty: 1,

        streak: 0

    };

}


/* =========================================================
   8. START TOY
   ---------------------------------------------------------
   This is the main entry point.

   Eventually this function will initialize:

   - Milo
   - audio
   - progress
   - learning engine
   - game engine
   - navigation
   ========================================================= */

function initializeTOY() {

    initializeDOM();

    loadState();

    resetGameSession();

    setupEventListeners();


    TOY.app.initialized = true;


    console.log(
        `TOY ${TOY.app.version} initialized.`
    );

}


/* =========================================================
   9. EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

    if (DOM.startButton) {

        DOM.startButton.addEventListener(
            "click",
            handleStart
        );

    }

}


/* =========================================================
   10. START BUTTON
   ---------------------------------------------------------
   Temporary behavior.

   We are NOT building the Home screen yet.

   This simply proves that our JavaScript architecture is
   connected correctly.
   ========================================================= */

function handleStart() {

    console.log("TOY: Start button activated.");

    saveState();

}


/* =========================================================
   11. APPLICATION START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeTOY
);
