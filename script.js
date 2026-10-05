(() => {
  "use strict";

  console.info("date-site build: v16");

  const config = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};

  const screens = {
    intro: document.getElementById("screenIntro"),
    ask: document.getElementById("screenAsk"),
    retry: document.getElementById("screenRetry"),
    celebrate: document.getElementById("screenCelebrate"),
    dates: document.getElementById("screenDates"),
    final: document.getElementById("screenFinal")
  };

  const introVideo = document.getElementById("introVideo");
  const backgroundMedia = document.getElementById("backgroundMedia");
  const memeLayer = document.getElementById("memeLayer");
  const confettiLayer = document.getElementById("confettiLayer");

  const introTitle = document.getElementById("introTitle");
  const introInsideJoke = document.getElementById("introInsideJoke");
  const introSubtitle = document.getElementById("introSubtitle");
  const supBtn = document.getElementById("supBtn");
  const questionText = document.getElementById("questionText");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const retryBtn = document.getElementById("retryBtn");
  const toDatesBtn = document.getElementById("toDatesBtn");

  const dateGrid = document.getElementById("dateGrid");

  const selectedDateTitle = document.getElementById("selectedDateTitle");
  const selectedDateBlurb = document.getElementById("selectedDateBlurb");
  const ticketDate = document.getElementById("ticketDate");
  const dealBtn = document.getElementById("dealBtn");
  const dealMessage = document.getElementById("dealMessage");
  const toast = document.getElementById("toast");

  let currentScreen = "intro";
  let sequenceTimer = null;
  let activeAudio = null;
  let toastTimer = null;

  let noAttempts = 0;
  let noOffsetX = 0;
  let noOffsetY = 0;
  let lastNoMoveAt = 0;
  const MAX_NO_DODGES = Math.max(0, (config.noSequence?.length || 1) - 1);

  let selectedDate = null;

  // ---------- COPY ----------
  document.title = `one important question for ${config.herName || "you"} ♡`;
  introTitle.textContent = config.ask?.introTitle || "herro wife?";
  introInsideJoke.textContent = config.ask?.introInsideJoke || "“Hibachi, Benihana, Teriyaki”";
  introSubtitle.textContent = config.ask?.introSubtitle || "can i ask u somethin";
  supBtn.textContent = config.ask?.introButton || "sup?";
  questionText.textContent = config.ask?.question || "can i take you out on a date :>";
  yesBtn.textContent = config.ask?.yesText || "yasssss";

  // ---------- AUDIO ----------
  // Ambient loop:
  // - hoa_hoa is one persistent track from the landing page through the date picker
  // Hover reactions:
  // - YES audio plays while hovering YES
  // - NO audio plays when the cursor reaches/attempts the dodging NO button
  const audioBank = {
    intro: document.getElementById("introAudio"),
    no: document.getElementById("noAudio"),
    noHover: document.getElementById("noHoverAudio"),
    yes: document.getElementById("yesAudio")
  };

  let activeClickAudio = null;
  let activeHoverAudio = null;
  let ambientAudio = null;
  let hoverStopTimer = null;
  let introAutoplaySucceeded = false;

  const HOA_SCREENS = new Set(["intro", "ask", "retry", "celebrate", "dates"]);

  function pauseHoaForForeground() {
    const hoa = audioBank.intro;
    if (!hoa) return;
    try { hoa.pause(); } catch (_) {}
  }

  function resumeHoaIfAllowed() {
    if (!HOA_SCREENS.has(currentScreen)) return;
    if (activeHoverAudio || activeClickAudio) return;

    const hoa = audioBank.intro;
    if (!hoa) return;

    try {
      hoa.loop = true;
      hoa.volume = 0.78;
      ambientAudio = hoa;
      if (!hoa.paused) return;

      const promise = hoa.play();
      promise?.catch?.((error) => {
        console.warn("[audio] could not resume hoa hoa", error);
      });
    } catch (error) {
      console.warn("[audio] failed to resume hoa hoa", error);
    }
  }

  Object.values(audioBank).forEach((audio) => {
    if (!audio) return;
    audio.preload = "auto";
    try { audio.load(); } catch (_) {}
  });

  function stopAudioElement(audio, { reset = true } = {}) {
    if (!audio) return;
    try {
      audio.pause();
      if (reset) audio.currentTime = 0;
      audio.loop = false;
    } catch (_) {}
  }

  function stopActiveAudio({ resumeAmbient = true } = {}) {
    if (activeClickAudio) {
      const audio = activeClickAudio;
      activeClickAudio = null;
      audio.onended = null;
      stopAudioElement(audio);
    }
    if (resumeAmbient) resumeHoaIfAllowed();
  }

  function stopHoverSound({ resumeAmbient = true } = {}) {
    clearTimeout(hoverStopTimer);
    hoverStopTimer = null;
    if (activeHoverAudio) {
      const audio = activeHoverAudio;
      activeHoverAudio = null;
      stopAudioElement(audio);
    }
    if (resumeAmbient) resumeHoaIfAllowed();
  }

  function playHoverSound(key, volume = 0.82, { autoStopMs = 0 } = {}) {
    const audio = audioBank[key];
    if (!audio) return;

    stopHoverSound({ resumeAmbient: false });
    pauseHoaForForeground();

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = autoStopMs <= 0;
      audio.volume = volume;
      activeHoverAudio = audio;

      const promise = audio.play();
      promise?.catch?.((error) => {
        console.warn("[audio] hover " + key + " blocked/failed", error);
        if (activeHoverAudio === audio) activeHoverAudio = null;
      });

      if (autoStopMs > 0) {
        hoverStopTimer = setTimeout(() => {
          if (activeHoverAudio === audio) stopHoverSound();
        }, autoStopMs);
      }
    } catch (error) {
      console.warn("[audio] hover " + key + " failed", error);
    }
  }

  function playSound(key, volume = 0.9) {
    const audio = audioBank[key];
    if (!audio) {
      console.warn("[audio] missing audio element for " + key);
      return;
    }

    stopHoverSound({ resumeAmbient: false });
    stopActiveAudio({ resumeAmbient: false });
    pauseHoaForForeground();

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
      audio.volume = volume;
      activeClickAudio = audio;
      audio.onended = () => {
        if (activeClickAudio === audio) activeClickAudio = null;
        audio.onended = null;
        resumeHoaIfAllowed();
      };

      const promise = audio.play();
      promise?.catch?.((error) => {
        console.warn("[audio] could not play " + key, error);
        if (activeClickAudio === audio) activeClickAudio = null;
        audio.onended = null;
        resumeHoaIfAllowed();
      });
    } catch (error) {
      console.warn("[audio] failed to start " + key, error);
      if (activeClickAudio === audio) activeClickAudio = null;
    }
  }

  function startAmbientLoop(key, volume = 0.78) {
    const audio = audioBank[key];
    if (!audio) return;

    if (ambientAudio && ambientAudio !== audio) {
      stopAudioElement(ambientAudio);
    }

    ambientAudio = audio;

    try {
      audio.loop = true;
      audio.volume = volume;
      if (Number.isFinite(audio.duration) && audio.duration > 0 && audio.currentTime >= audio.duration - 0.08) {
        audio.currentTime = 0;
      }

      const promise = audio.play();
      promise?.catch?.((error) => {
        console.warn("[audio] ambient " + key + " blocked/failed", error);
      });
    } catch (error) {
      console.warn("[audio] ambient " + key + " failed", error);
    }
  }

  function stopAmbientLoop(key = null) {
    if (!ambientAudio) return;
    if (key && ambientAudio !== audioBank[key]) return;
    stopAudioElement(ambientAudio);
    ambientAudio = null;
  }

  function startIntroLoop() {
    if (!HOA_SCREENS.has(currentScreen)) return;
    if (activeHoverAudio || activeClickAudio) return;
    const audio = audioBank.intro;
    if (!audio) return;

    try {
      audio.loop = true;
      audio.volume = 0.78;
      ambientAudio = audio;

      // Keep one uninterrupted HOA track. Do not call play() again on every screen
      // transition if the same element is already playing.
      if (!audio.paused) {
        introAutoplaySucceeded = true;
        return;
      }

      const promise = audio.play();
      if (promise?.then) {
        promise
          .then(() => {
            introAutoplaySucceeded = true;
            console.info("[audio] hoa hoa loop started");
          })
          .catch((error) => {
            console.warn("[audio] browser blocked unmuted intro autoplay", error);
          });
      }
    } catch (error) {
      console.warn("[audio] intro autoplay failed", error);
    }
  }

  function stopIntroLoop() {
    if (ambientAudio === audioBank.intro) ambientAudio = null;
    stopAudioElement(audioBank.intro);
  }

  // Try audible autoplay immediately. If the browser blocks it, retry on the
  // first real interaction without showing any extra "enable audio" UI.
  document.addEventListener("DOMContentLoaded", startIntroLoop, { once: true });
  window.addEventListener("load", startIntroLoop, { once: true });

  const retryIntroAfterGesture = () => {
    if (currentScreen === "intro" && !introAutoplaySucceeded) startIntroLoop();
  };
  document.addEventListener("pointerdown", retryIntroAfterGesture, { capture: true, passive: true });
  document.addEventListener("keydown", retryIntroAfterGesture, { capture: true });

  // Preload the important GIFs so hover and retry transitions feel immediate.
  function preloadImage(src) {
    if (!src) return;
    const img = new Image();
    img.src = src;
  }

  [
    config.ask?.hoverYesBackground,
    config.ask?.hoverNoBackground,
    config.backgrounds?.ask,
    config.backgrounds?.retry,
    config.backgrounds?.celebrate
  ].forEach(preloadImage);

  // ---------- BACKGROUNDS ----------
  function stopBackgroundSequence() {
    if (sequenceTimer !== null) {
      clearInterval(sequenceTimer);
      sequenceTimer = null;
    }
  }

  function setBackgroundSource(src) {
    if (!src) {
      backgroundMedia.classList.remove("is-visible");
      backgroundMedia.style.backgroundImage = "";
      return;
    }
    backgroundMedia.style.backgroundImage = `url("${String(src).replaceAll('"', '\\"')}")`;
    backgroundMedia.classList.add("is-visible");
  }

  function setBackground(name) {
    setBackgroundSource(config.backgrounds?.[name] || "");
  }

  function startBackgroundSequence(name) {
    const sequence = config.backgroundSequences?.[name];
    if (!sequence?.items?.length) return;

    let index = 0;
    setBackgroundSource(sequence.items[index]);
    sequenceTimer = setInterval(() => {
      index = (index + 1) % sequence.items.length;
      setBackgroundSource(sequence.items[index]);
    }, sequence.interval || 2500);
  }

  function syncIntroVideo(name) {
    if (!introVideo) return;
    if (name === "intro") {
      introVideo.currentTime = 0;
      introVideo.play().catch(() => {});
    } else {
      introVideo.pause();
    }
  }

  function showScreen(name) {
    stopBackgroundSequence();

    Object.entries(screens).forEach(([key, el]) => {
      el.classList.toggle("screen--active", key === name);
    });

    currentScreen = name;
    document.body.dataset.screen = name;
    if (HOA_SCREENS.has(name)) {
      startIntroLoop();
    } else {
      stopIntroLoop();
    }
    stopHoverSound();
    syncIntroVideo(name);
    renderMemes(name);

    if (name === "intro") {
      setBackgroundSource("");
      return;
    }

    setBackground(name);
    if (config.backgroundSequences?.[name]) startBackgroundSequence(name);
  }

  function renderMemes(page) {
    memeLayer.innerHTML = "";
    (config.memes || []).forEach((meme, index) => {
      if (!meme?.src) return;
      const pages = meme.pages || ["all"];
      if (!(pages.includes("all") || pages.includes(page))) return;

      const img = document.createElement("img");
      img.className = "meme-sticker";
      img.src = meme.src;
      img.alt = "";
      img.style.left = `${meme.x ?? 5}%`;
      img.style.top = `${meme.y ?? 8}%`;
      img.style.width = `${meme.width ?? 140}px`;
      img.style.opacity = meme.opacity ?? 0.88;
      img.style.setProperty("--rotation", `${meme.rotate ?? 0}deg`);
      img.style.animationDelay = `${(index % 6) * -0.55}s`;
      img.onerror = () => img.remove();
      memeLayer.appendChild(img);
    });
  }

  // ---------- PAGE 1 ----------
  supBtn.addEventListener("click", () => {
    // Keep HOA uninterrupted as we move into the question.
    showScreen("ask");
  });

  // ---------- PAGE 2: HOVER BACKGROUNDS + YES/NO HOVER AUDIO ----------
  yesBtn.addEventListener("mouseenter", () => {
    if (currentScreen !== "ask") return;
    if (config.ask?.hoverYesBackground) setBackgroundSource(config.ask.hoverYesBackground);
    playHoverSound("yes", 0.88);
  });

  yesBtn.addEventListener("mouseleave", () => {
    stopHoverSound();
    if (currentScreen === "ask") setBackground("ask");
  });

  let noReactionTimer = null;

  function showNoReaction(duration = 900) {
    if (currentScreen !== "ask" || !config.ask?.hoverNoBackground) return;
    clearTimeout(noReactionTimer);
    setBackgroundSource(config.ask.hoverNoBackground);
    noReactionTimer = setTimeout(() => {
      if (currentScreen === "ask") setBackground("ask");
    }, duration);
  }

  noBtn.addEventListener("mouseenter", () => {
    showNoReaction(1100);
    playHoverSound("noHover", 0.86);
  });

  noBtn.addEventListener("mouseleave", () => {
    stopHoverSound();
    // The timed reaction stays visible briefly even when the button dodges away.
  });

  // ---------- NO BUTTON: QUICK, SMOOTH DODGE ----------
  // Text changes FIRST, then the button glides away from the pointer.
  // No fire, no shake, and YES stays exactly the same size.
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateNoText() {
    const sequence = config.noSequence || ["no"];
    noBtn.textContent = sequence[Math.min(noAttempts, sequence.length - 1)];
  }

  function moveNoButtonAwayFrom(clientX, clientY) {
    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = cx - clientX;
    let dy = cy - clientY;
    let length = Math.hypot(dx, dy);

    // If the pointer is exactly centered, choose a random escape direction.
    if (length < 1) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      length = 1;
    }

    dx /= length;
    dy /= length;

    const jump = 175 + Math.random() * 95;
    const sideways = (Math.random() - 0.5) * 80;

    const stepX = dx * jump + (-dy * sideways);
    const stepY = dy * jump + ( dx * sideways);

    const maxX = Math.min(390, window.innerWidth * 0.38);
    const maxY = Math.min(245, window.innerHeight * 0.31);

    noOffsetX = clamp(noOffsetX + stepX, -maxX, maxX);
    noOffsetY = clamp(noOffsetY + stepY, -maxY, maxY);

    noBtn.style.transform = `translate3d(${Math.round(noOffsetX)}px, ${Math.round(noOffsetY)}px, 0)`;
  }

  function registerNoDodge(clientX, clientY) {
    if (currentScreen !== "ask" || noAttempts >= MAX_NO_DODGES) return;

    // 1) change the copy immediately
    noAttempts += 1;
    updateNoText();
    showNoReaction(780);
    // The NO button usually escapes before a literal CSS hover can happen,
    // so treat a dodge attempt as the hover reaction and play the NO sound immediately.
    playHoverSound("noHover", 0.86, { autoStopMs: 700 });
    lastNoMoveAt = performance.now();

    // 2) on the very next paint, move away smoothly
    requestAnimationFrame(() => {
      moveNoButtonAwayFrom(clientX, clientY);
    });
  }

  const NO_TRIGGER_RADIUS = 112;
  const NO_DODGE_COOLDOWN = 145;

  // Desktop: when the cursor gets close enough, dodge immediately.
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (currentScreen !== "ask" || noAttempts >= MAX_NO_DODGES) return;

    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
    const now = performance.now();

    if (distance < NO_TRIGGER_RADIUS && now - lastNoMoveAt > NO_DODGE_COOLDOWN) {
      registerNoDodge(event.clientX, event.clientY);
    }
  }, { passive: true });

  // This guarantees the text reacts instantly if the pointer actually reaches the button.
  noBtn.addEventListener("pointerenter", (event) => {
    if (currentScreen !== "ask" || noAttempts >= MAX_NO_DODGES) return;
    const now = performance.now();
    if (now - lastNoMoveAt > 90) {
      registerNoDodge(event.clientX, event.clientY);
    }
  });

  // Touch / successful mouse catch: change text and move on pointer-down, before click.
  noBtn.addEventListener("pointerdown", (event) => {
    if (currentScreen !== "ask") return;
    if (noAttempts < MAX_NO_DODGES) {
      event.preventDefault();
      event.stopPropagation();
      registerNoDodge(event.clientX, event.clientY);
    }
  });

  noBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Until the full sequence has played, even a successful click just makes it escape again.
    if (noAttempts < MAX_NO_DODGES) {
      registerNoDodge(event.clientX, event.clientY);
      return;
    }

    // After the final phrase, NO becomes catchable and this is the ONLY place no.mp3 plays.
    playSound("no", 0.9);
    showScreen("retry");
  });

  function resetQuestionPage() {
    noAttempts = 0;
    noOffsetX = 0;
    noOffsetY = 0;
    lastNoMoveAt = 0;
    noBtn.style.transform = "translate3d(0,0,0)";
    noBtn.textContent = (config.noSequence || ["no"])[0] || "no";
    questionText.textContent = config.ask?.question || "can i take you out on a date :>";
    yesBtn.textContent = config.ask?.yesText || "yasssss";
    showScreen("ask");
  }

  retryBtn.addEventListener("click", () => {
    // Cut the NO audio immediately so the return to the question feels synced.
    stopActiveAudio();
    resetQuestionPage();
  });

  // ---------- YES: ORIGINAL 'HELL YEAH BABY' PAGE ----------
  yesBtn.addEventListener("click", () => {
    // This is the ONLY place yes.mp3 plays.
    playSound("yes", 0.95);
    showScreen("celebrate");
  });

  toDatesBtn.addEventListener("click", () => {
    stopHoverSound();
    showScreen("dates");
    renderDateGrid();
  });

  // ---------- DATE GRID ----------
  function renderDateGrid() {
    if (!dateGrid) return;

    dateGrid.innerHTML = "";

    config.dates.forEach((date) => {
      const card = document.createElement("article");
      card.className = "date-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        date.shortTitle + ". Tap to flip card."
      );

      const front = document.createElement("div");
      front.className = "date-face date-front";

      front.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.14), rgba(0,0,0,.42)), url("' +
        date.image +
        '")';

      front.innerHTML = `
        <div class="date-heart">&lt;3</div>

        <div class="date-front-center">
          <h2 class="date-front-title">
            ${escapeHtml(date.shortTitle)}
          </h2>
        </div>

        <div class="tap-label">
          tap to reveal
        </div>
      `;

      const back = document.createElement("div");
      back.className = "date-face date-back";

      back.style.backgroundImage =
        'linear-gradient(rgba(0,0,0,.58), rgba(0,0,0,.72)), url("' +
        date.image +
        '")';

      back.innerHTML = `
        <div class="date-back-content">
          <p class="date-back-copy">
            ${escapeHtml(date.body)}
          </p>

          <button
            class="btn btn--yes pick-date-btn"
            type="button"
          >
            pick this one ♡
          </button>
        </div>
      `;

      card.append(front, back);
      dateGrid.appendChild(card);

      const flip = () => {
        card.classList.toggle("is-flipped");
      };

      card.addEventListener("click", (event) => {
        if (event.target.closest(".pick-date-btn")) return;
        flip();
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          flip();
        }
      });

      back
        .querySelector(".pick-date-btn")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          selectDate(date, card);
        });
    });
  }

  function selectDate(date, card) {
    selectedDate = date;

    const stamp = document.createElement("div");
    stamp.className = "selection-stamp";
    stamp.innerHTML = "<span>SELECTED ♡</span>";
    card.appendChild(stamp);

    setTimeout(() => {
      selectedDateTitle.textContent = date.shortTitle;
      selectedDateBlurb.textContent = date.tag;
      ticketDate.textContent = date.shortTitle;
      showScreen("final");
      launchConfetti(70);
    }, 850);
  }

  // ---------- FINAL ----------
  dealBtn.addEventListener("click", () => {
    dealMessage.textContent = "hehe. see you then, pretty girl ♡";
    dealBtn.textContent = "DATE LOCKED ♡";
    dealBtn.disabled = true;
    launchConfetti(95);
    showToast(selectedDate ? `${selectedDate.shortTitle} locked in ♡` : "date locked in ♡");
  });

  // ---------- EFFECTS ----------
  function launchConfetti(count = 90) {
    const symbols = ["♥", "♡", "💗", "✨", "💕", "★"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.setProperty("--duration", `${2.4 + Math.random() * 2.8}s`);
      piece.style.setProperty("--size", `${12 + Math.random() * 18}px`);
      piece.style.setProperty("--drift", `${-120 + Math.random() * 240}px`);
      piece.style.setProperty("--spin", `${-450 + Math.random() * 900}deg`);
      piece.style.color = ["#d94f72", "#ee8ea4", "#f6b5c5", "#ffffff"][Math.floor(Math.random() * 4)];
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 5600);
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ---------- FIRST PAINT ----------
  document.body.dataset.screen = "intro";
  updateNoText();
  setBackgroundSource("");
  renderMemes("intro");
  introVideo?.play().catch(() => {});
})();
