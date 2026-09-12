/* =========================================================
   TOY — MASTER SCREEN APP
   Version 1.1.0
   ========================================================= */

const TOY_STATE_KEY = "toy-v1-state";

const state = {
  app: {
    name: "TOY",
    version: "1.1.0",
    initialized: false
  },

  screen: {
    current: "home"
  },

  progress: {
    level: 1,
    stars: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  },

  game: {
    active: false,
    currentQuestion: null,
    currentPattern: null,
    difficulty: "easy",
    streak: 0
  },

  audio: {
    soundEnabled: true,
    voiceEnabled: true
  }
};


/* =========================================================
   DOM
   ========================================================= */

const DOM = {};


/* =========================================================
   INITIALIZE DOM
   ========================================================= */

function initializeDOM() {
  DOM.screen = document.getElementById("screen");

  DOM.startButton =
    document.getElementById("start-button");

  DOM.soundButton =
    document.getElementById("sound-button");

  DOM.soundIcon =
    document.getElementById("sound-icon");

  DOM.settingsButton =
    document.getElementById("settings-button");

  DOM.milo =
    document.getElementById("milo");

  DOM.miloBubble =
    document.getElementById("milo-bubble");

  DOM.toast =
    document.getElementById("toast");

  DOM.starCount =
    document.getElementById("star-count");

  DOM.progressMeter =
    document.getElementById("progress-meter");

  DOM.progressCard =
    document.getElementById("progress-card");

  DOM.activityCards =
    document.querySelectorAll(".activity-card");

  DOM.bootScreen =
    document.getElementById("boot-screen");
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveState() {
  try {
    localStorage.setItem(
      TOY_STATE_KEY,
      JSON.stringify(state)
    );
  } catch (error) {
    console.warn(
      "TOY could not save state.",
      error
    );
  }
}


function loadState() {
  try {
    const saved =
      localStorage.getItem(TOY_STATE_KEY);

    if (!saved) {
      return;
    }

    const parsed =
      JSON.parse(saved);

    if (parsed.progress) {
      state.progress = {
        ...state.progress,
        ...parsed.progress
      };
    }

    if (parsed.audio) {
      state.audio = {
        ...state.audio,
        ...parsed.audio
      };
    }

  } catch (error) {
    console.warn(
      "TOY could not load saved state.",
      error
    );
  }
}


/* =========================================================
   SCREEN
   ========================================================= */

function showScreen(screenName) {
  state.screen.current = screenName;

  saveState();
}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgressUI() {

  if (DOM.starCount) {
    const stars = state.progress.stars;

    DOM.starCount.textContent =
      `${stars} ${stars === 1 ? "star" : "stars"}`;
  }


  if (DOM.progressMeter) {

    const stars =
      state.progress.stars;

    const percentage =
      Math.min(
        100,
        (stars % 10) * 10
      );

    DOM.progressMeter.style.width =
      `${percentage}%`;
  }
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message) {

  if (!DOM.toast) {
    return;
  }

  DOM.toast.textContent = message;

  DOM.toast.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {
      DOM.toast.classList.remove("visible");
    }, 2200);
}


/* =========================================================
   MILO
   ========================================================= */

let miloTimer = null;

function miloSpeak(message, duration = 2600) {

  if (!DOM.miloBubble) {
    return;
  }

  DOM.miloBubble.textContent =
    message;

  DOM.miloBubble.classList.add(
    "visible"
  );

  clearTimeout(miloTimer);

  miloTimer =
    setTimeout(() => {
      DOM.miloBubble.classList.remove(
        "visible"
      );
    }, duration);
}


function miloReact(type = "happy") {

  if (!DOM.milo) {
    return;
  }

  DOM.milo.classList.remove(
    "milo-happy",
    "milo-curious",
    "milo-surprised"
  );

  /*
    Force browser to recognize the
    animation restarting.
  */
  void DOM.milo.offsetWidth;

  DOM.milo.classList.add(
    `milo-${type}`
  );

  setTimeout(() => {

    DOM.milo.classList.remove(
      `milo-${type}`
    );

  }, 800);
}


/* =========================================================
   START EXPERIENCE
   ========================================================= */

function handleStart() {

  state.progress.stars += 1;

  state.game.active = true;

  showScreen("home");

  updateProgressUI();

  saveState();

  miloReact("happy");

  miloSpeak(
    "Nice! Let's begin. ✨"
  );

  showToast(
    "You found your first star!"
  );
}


/* =========================================================
   SOUND
   ========================================================= */

function updateSoundUI() {

  if (!DOM.soundIcon) {
    return;
  }

  DOM.soundIcon.textContent =
    state.audio.soundEnabled
      ? "🔊"
      : "🔇";
}


function toggleSound() {

  state.audio.soundEnabled =
    !state.audio.soundEnabled;

  updateSoundUI();

  saveState();

  if (state.audio.soundEnabled) {

    miloReact("happy");

    miloSpeak(
      "Sound is back! 🔊"
    );

  } else {

    miloSpeak(
      "Okay, I'll be quiet. 🤫"
    );
  }
}


/* =========================================================
   SETTINGS
   ========================================================= */

function handleSettings() {

  miloReact("curious");

  miloSpeak(
    "Settings are coming soon! ⚙️"
  );

  showToast(
    "TOY settings are still growing."
  );
}


/* =========================================================
   ACTIVITY CARDS
   ========================================================= */

function handleActivity(action) {

  switch (action) {

    case "learn":

      miloReact("happy");

      miloSpeak(
        "Let's learn something new! 📚"
      );

      showToast(
        "Learning world coming next."
      );

      break;


    case "explore":

      miloReact("curious");

      miloSpeak(
        "Ooooh... what should we discover? 🔎"
      );

      showToast(
        "Let's follow your curiosity."
      );

      break;


    case "create":

      miloReact("happy");

      miloSpeak(
        "Let's make something! ✨"
      );

      showToast(
        "Creative world coming next."
      );

      break;


    default:

      miloReact("curious");

      miloSpeak(
        "Hmm... I wonder."
      );
  }
}


/* =========================================================
   MILO INTERACTION
   ========================================================= */

function handleMiloInteraction() {

  const reactions = [
    {
      type: "happy",
      message: "Hehe! You found me. 👋"
    },

    {
      type: "curious",
      message: "Where are we going?"
    },

    {
      type: "surprised",
      message: "Whoa! 😮"
    },

    {
      type: "happy",
      message: "Let's explore!"
    }
  ];

  const reaction =
    reactions[
      Math.floor(
        Math.random() * reactions.length
      )
    ];

  miloReact(
    reaction.type
  );

  miloSpeak(
    reaction.message
  );
}


/* =========================================================
   PROGRESS INTERACTION
   ========================================================= */

function handleProgress() {

  miloReact("happy");

  miloSpeak(
    `You've collected ${state.progress.stars} ${
      state.progress.stars === 1
        ? "star"
        : "stars"
    }! ⭐`
  );

  showToast(
    "Every little discovery counts."
  );
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

  if (DOM.startButton) {

    DOM.startButton.addEventListener(
      "click",
      handleStart
    );
  }


  if (DOM.soundButton) {

    DOM.soundButton.addEventListener(
      "click",
      toggleSound
    );
  }


  if (DOM.settingsButton) {

    DOM.settingsButton.addEventListener(
      "click",
      handleSettings
    );
  }


  if (DOM.milo) {

    DOM.milo.addEventListener(
      "click",
      handleMiloInteraction
    );

    DOM.milo.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          handleMiloInteraction();
        }
      }
    );
  }


  DOM.activityCards.forEach(
    (card) => {

      card.addEventListener(
        "click",
        () => {

          const action =
            card.dataset.action;

          handleActivity(action);
        }
      );
    }
  );


  if (DOM.progressCard) {

    DOM.progressCard.addEventListener(
      "click",
      handleProgress
    );
  }
}


/* =========================================================
   INITIAL MILO GREETING
   ========================================================= */

function initialMiloGreeting() {

  setTimeout(() => {

    miloSpeak(
      "Hi! I'm Milo 👋"
    );

  }, 900);
}


/* =========================================================
   INITIALIZE TOY
   ========================================================= */

function initializeTOY() {

  initializeDOM();

  loadState();

  updateProgressUI();

  updateSoundUI();

  setupEventListeners();

  state.app.initialized = true;

  saveState();

  /*
    Give the browser a moment to
    render before Milo appears.
  */
  setTimeout(() => {

    if (DOM.bootScreen) {
      DOM.bootScreen.classList.add(
        "boot-hidden"
      );
    }

    initialMiloGreeting();

  }, 350);
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeTOY
);
