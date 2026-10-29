$(document).ready(function () {
  var envelope = $("#envelope");
  var storyOpened = false;
  var surpriseRevealed = false;
  var bgAudio = document.getElementById("bg-romantic-audio");
  var isMusicMutedByUser = false;

  /* =====================================================
     GENERATOR MUSIK ROMANTIS (KOTAK MUSIK & PIANO HANGAT)
     Berjalan 100% Otomatis Tanpa Perlu Internet Eksternal
     ===================================================== */
  function initRomanticMusicSource() {
    if (!bgAudio) return;
    try {
      var sampleRate = 22050;
      var duration = 24;
      var numSamples = sampleRate * duration;
      var floatSamples = new Float32Array(numSamples);

      // Melodi Romantis & Arpeggio (F Major - C/E - Dm7 - Am7 - Bbmaj7 - Fmaj9)
      var notes = [
        // Bar 1: Fmaj7
        { t: 0.0, f: 174.61, d: 3.0, v: 0.2 },
        { t: 0.45, f: 261.63, d: 2.5, v: 0.16 },
        { t: 0.9, f: 349.23, d: 2.2, v: 0.18 },
        { t: 1.35, f: 440.0, d: 2.2, v: 0.24 },
        { t: 2.1, f: 523.25, d: 1.8, v: 0.26 },
        // Bar 2: C/E
        { t: 3.0, f: 164.81, d: 3.0, v: 0.2 },
        { t: 3.45, f: 261.63, d: 2.5, v: 0.16 },
        { t: 3.9, f: 392.0, d: 2.2, v: 0.18 },
        { t: 4.35, f: 523.25, d: 1.6, v: 0.24 },
        { t: 5.1, f: 493.88, d: 1.6, v: 0.22 },
        // Bar 3: Dm7
        { t: 6.0, f: 146.83, d: 3.0, v: 0.2 },
        { t: 6.45, f: 220.0, d: 2.5, v: 0.16 },
        { t: 6.9, f: 349.23, d: 2.2, v: 0.18 },
        { t: 7.35, f: 440.0, d: 1.8, v: 0.24 },
        { t: 8.1, f: 392.0, d: 1.7, v: 0.21 },
        // Bar 4: Am7
        { t: 9.0, f: 220.0, d: 3.0, v: 0.19 },
        { t: 9.45, f: 329.63, d: 2.5, v: 0.16 },
        { t: 9.9, f: 392.0, d: 2.2, v: 0.18 },
        { t: 10.4, f: 349.23, d: 2.4, v: 0.23 },
        // Bar 5: Bbmaj7
        { t: 12.0, f: 233.08, d: 3.0, v: 0.2 },
        { t: 12.45, f: 293.66, d: 2.5, v: 0.16 },
        { t: 12.9, f: 349.23, d: 2.2, v: 0.18 },
        { t: 13.35, f: 440.0, d: 1.6, v: 0.24 },
        { t: 14.1, f: 587.33, d: 1.9, v: 0.26 },
        // Bar 6: Am7 -> Dm7
        { t: 15.0, f: 220.0, d: 3.0, v: 0.2 },
        { t: 15.45, f: 329.63, d: 2.5, v: 0.16 },
        { t: 15.9, f: 523.25, d: 1.6, v: 0.24 },
        { t: 16.65, f: 440.0, d: 1.9, v: 0.22 },
        // Bar 7: Gm7 -> C7
        { t: 18.0, f: 196.0, d: 3.0, v: 0.2 },
        { t: 18.45, f: 293.66, d: 2.5, v: 0.16 },
        { t: 18.9, f: 349.23, d: 1.9, v: 0.2 },
        { t: 19.65, f: 392.0, d: 2.1, v: 0.24 },
        // Bar 8: Fmaj9
        { t: 21.0, f: 174.61, d: 3.0, v: 0.2 },
        { t: 21.4, f: 261.63, d: 2.6, v: 0.16 },
        { t: 21.8, f: 349.23, d: 2.2, v: 0.18 },
        { t: 22.2, f: 440.0, d: 1.8, v: 0.22 },
        { t: 22.6, f: 523.25, d: 1.4, v: 0.25 },
      ];

      for (var nIdx = 0; nIdx < notes.length; nIdx++) {
        var n = notes[nIdx];
        var startIdx = Math.floor(n.t * sampleRate);
        var len = Math.floor(n.d * sampleRate);
        for (var i = 0; i < len && startIdx + i < numSamples; i++) {
          var localT = i / sampleRate;
          var attack = Math.min(1, localT / 0.025);
          var decay = Math.exp(-localT * 1.4);
          var env = attack * decay * n.v;
          var wave =
            Math.sin(2 * Math.PI * n.f * localT) * 0.72 +
            Math.sin(2 * Math.PI * (n.f * 2) * localT) * 0.2 * Math.exp(-localT * 2.4) +
            Math.sin(2 * Math.PI * (n.f * 3) * localT) * 0.08 * Math.exp(-localT * 3.8);
          floatSamples[startIdx + i] += wave * env;
        }
      }

      // Efek gema lembut (Reverb tail)
      var delaySamples = Math.floor(0.27 * sampleRate);
      for (var d = delaySamples; d < numSamples; d++) {
        floatSamples[d] += floatSamples[d - delaySamples] * 0.32;
      }

      // Encode ke WAV Buffer
      var buffer = new ArrayBuffer(44 + numSamples * 2);
      var view = new DataView(buffer);

      function writeStr(offset, str) {
        for (var k = 0; k < str.length; k++) {
          view.setUint8(offset + k, str.charCodeAt(k));
        }
      }

      writeStr(0, "RIFF");
      view.setUint32(4, 36 + numSamples * 2, true);
      writeStr(8, "WAVE");
      writeStr(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeStr(36, "data");
      view.setUint32(40, numSamples * 2, true);

      for (var s = 0; s < numSamples; s++) {
        var clamped = Math.max(-0.95, Math.min(0.95, floatSamples[s]));
        view.setInt16(44 + s * 2, Math.floor(clamped * 32767), true);
      }

      var blob = new Blob([buffer], { type: "audio/wav" });
      bgAudio.src = URL.createObjectURL(blob);
      bgAudio.volume = 0.75;
    } catch (err) {
      // Fallback aman bila browser lawas
    }
  }

  initRomanticMusicSource();

  function startRomanticMusic() {
    if (!bgAudio || isMusicMutedByUser) return;
    bgAudio.volume = 0.78;
    var playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          $("#music-bars").removeClass("paused");
          $("#music-status-text").text("Alunan Musik Romantis Berputar");
        })
        .catch(function () {
          $("#music-bars").addClass("paused");
          $("#music-status-text").text("Sentuh untuk Memutar Musik");
        });
    }
  }

  $("#music-toggle-pill").on("click keypress", function (e) {
    if (e.type === "keypress" && e.which !== 13 && e.which !== 32) return;
    if (!bgAudio) return;

    if (bgAudio.paused) {
      isMusicMutedByUser = false;
      bgAudio.play();
      $("#music-bars").removeClass("paused");
      $("#music-status-text").text("Alunan Musik Romantis Berputar");
    } else {
      isMusicMutedByUser = true;
      bgAudio.pause();
      $("#music-bars").addClass("paused");
      $("#music-status-text").text("Musik Dijeda (Sentuh untuk Putar)");
    }
  });

  /* =====================================================
     TAHAP 1: SENTUH AMPLOP (MEMBUKA RAHASIA PERTAMA)
     ===================================================== */
  envelope.on("click keypress", function (e) {
    if (e.type === "keypress" && e.which !== 13 && e.which !== 32) return;

    if (envelope.hasClass("close")) {
      envelope.addClass("open").removeClass("close");
      spawnCelebrationHearts(26);

      $("#mystery-title").text("Ternyata benar kamu, Beloved Silvia Rahma.");
      $("#mystery-subtitle").html(
        "Selamat memasuki usia <strong>23 Tahun</strong>. Gulir perlahan ke bawah untuk membaca isi suratmu."
      );
      $("#curious-hint").text("Membuka lembaran rahasia untukmu...");

      if (!storyOpened) {
        storyOpened = true;
        setTimeout(function () {
          $("#stage-curious").addClass("compact-mode");
          $("#stage-story").removeClass("hidden-stage");
          $("#curious-hint").text("Gulir ke bawah untuk membaca surat");

          $(".reveal-block").each(function (idx, el) {
            setTimeout(function () {
              $(el).addClass("visible");
            }, idx * 450);
          });

          setTimeout(function () {
            var storyTop = $("#stage-story").offset().top - 20;
            window.scrollTo({ top: storyTop, behavior: "smooth" });
          }, 350);
        }, 1500);
      }
    }
  });

  /* =====================================================
     TAHAP 2 KE TAHAP 3: TIUP LILIN 23 TAHUN -> KEJUTAN TERAKHIR
     (OTOMATIS MEMUTAR MUSIK + AUTO-SLIDE + HATI BERTERBANGAN)
     ===================================================== */
  $("#cake-trigger").on("click keypress", function (e) {
    if (e.type === "keypress" && e.which !== 13 && e.which !== 32) return;

    $("#flame-1, #flame-2").addClass("out");
    $("#smoke-1, #smoke-2").removeClass("active");
    void document.getElementById("smoke-1").offsetWidth;
    $("#smoke-1, #smoke-2").addClass("active");

    $("#candle-instruction").html(
      "Selamat ulang tahun yang ke-<strong>23 tahun</strong>, <strong>Beloved Silvia Rahma</strong>. Semoga segala doa baikmu dikabulkan. Sekarang, lihatlah kejutan terakhir di bawah ini..."
    );
    $("#candle-hint").text("Menampilkan galeri kenangan & memutar musik otomatis...");

    // Putar musik otomatis tepat saat masuk ke kejutan terakhir
    startRomanticMusic();
    spawnCelebrationHearts(45);

    if (!surpriseRevealed) {
      surpriseRevealed = true;
      setTimeout(function () {
        $("#stage-final-surprise").removeClass("hidden-stage");

        var surpriseTop = $("#stage-final-surprise").offset().top - 16;
        window.scrollTo({ top: surpriseTop, behavior: "smooth" });

        setTimeout(function () {
          initRomanticAutoSlider();
        }, 550);
      }, 900);
    }
  });

  /* =====================================================
     AUTO-SLIDE OTOMATIS DENGAN ANIMASI LOVE BERTERBANGAN
     ===================================================== */
  var slides = $(".memory-slide");
  var totalSlides = slides.length;
  var currentSlide = 0;
  var SLIDE_INTERVAL_MS = 4200;
  var slideTimer = null;
  var progressStartTime = 0;
  var progressAnimFrame = null;
  var isVideoPlaying = false;

  var dotsContainer = $("#slider-dots");
  $("#slide-total-count").text(totalSlides < 10 ? "0" + totalSlides : totalSlides);

  slides.each(function (idx) {
    var dot = $(
      '<button type="button" class="slider-dot' +
        (idx === 0 ? " active-dot" : "") +
        '" data-slide="' +
        idx +
        '" aria-label="Slide ' +
        (idx + 1) +
        '"></button>'
    );
    dotsContainer.append(dot);
  });

  function spawnSlideTransitionHearts() {
    var heartsLayer = $("#slider-flying-hearts");
    var colors = ["#fb7185", "#e11d48", "#fde68a", "#f43f5e", "#f472b6"];

    for (var i = 0; i < 18; i++) {
      var leftPos = 5 + Math.random() * 90;
      var dx = (Math.random() - 0.5) * 160 + "px";
      var dur = (2.1 + Math.random() * 1.4).toFixed(2) + "s";
      var sc = (0.7 + Math.random() * 0.85).toFixed(2);
      var rot = Math.round((Math.random() - 0.5) * 70) + "deg";
      var color = colors[Math.floor(Math.random() * colors.length)];
      var delay = (Math.random() * 0.45).toFixed(2) + "s";

      var heartEl = $('<div class="flying-slide-heart"></div>');
      heartEl.css({
        left: leftPos + "%",
        "--dx": dx,
        "--dur": dur,
        "--sc": sc,
        "--rot": rot,
        "--hc": color,
        "animation-delay": delay,
      });

      heartsLayer.append(heartEl);

      (function (el) {
        setTimeout(function () {
          el.remove();
        }, 3800);
      })(heartEl);
    }

    var card = $("#romantic-slider-card");
    card.addClass("slide-glow-burst");
    setTimeout(function () {
      card.removeClass("slide-glow-burst");
    }, 750);

    spawnCelebrationHearts(28);
  }

  function goToSlide(nextIndex) {
    if (nextIndex === currentSlide) return;

    var prevSlideEl = slides.eq(currentSlide);
    var nextSlideEl = slides.eq(nextIndex);

    var vid = document.getElementById("surprise-video");
    if (vid && !vid.paused) {
      vid.pause();
    }

    prevSlideEl.removeClass("active-slide").addClass("leaving-slide");
    setTimeout(function () {
      prevSlideEl.removeClass("leaving-slide");
    }, 1050);

    nextSlideEl.addClass("active-slide");
    currentSlide = nextIndex;

    var numStr = currentSlide + 1 < 10 ? "0" + (currentSlide + 1) : String(currentSlide + 1);
    $("#slide-current-index").text(numStr);
    $(".slider-dot").removeClass("active-dot");
    $('.slider-dot[data-slide="' + currentSlide + '"]').addClass("active-dot");

    spawnSlideTransitionHearts();

    // Jika masuk ke slide video, putar videonya secara otomatis juga
    if (nextSlideEl.data("type") === "video" && vid) {
      vid.currentTime = 0;
      var vidPlay = vid.play();
      if (vidPlay !== undefined) {
        vidPlay.catch(function () {
          restartAutoSlideTimer();
        });
      }
    } else {
      restartAutoSlideTimer();
    }
  }

  function nextSlide() {
    var nextIdx = (currentSlide + 1) % totalSlides;
    goToSlide(nextIdx);
  }

  function prevSlide() {
    var prevIdx = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIdx);
  }

  function updateProgressBar(timestamp) {
    if (isVideoPlaying) {
      $("#slide-progress-bar").css("width", "100%");
      return;
    }
    if (!progressStartTime) progressStartTime = timestamp;
    var elapsed = timestamp - progressStartTime;
    var pct = Math.min(100, (elapsed / SLIDE_INTERVAL_MS) * 100);
    $("#slide-progress-bar").css("width", pct + "%");

    if (elapsed < SLIDE_INTERVAL_MS) {
      progressAnimFrame = requestAnimationFrame(updateProgressBar);
    }
  }

  function restartAutoSlideTimer() {
    if (slideTimer) clearTimeout(slideTimer);
    if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);

    if (isVideoPlaying) return;

    progressStartTime = 0;
    $("#slide-progress-bar").css("width", "0%");
    progressAnimFrame = requestAnimationFrame(updateProgressBar);

    slideTimer = setTimeout(function () {
      nextSlide();
    }, SLIDE_INTERVAL_MS);
  }

  function initRomanticAutoSlider() {
    spawnSlideTransitionHearts();
    restartAutoSlideTimer();
  }

  dotsContainer.on("click", ".slider-dot", function () {
    var targetIdx = Number($(this).data("slide"));
    goToSlide(targetIdx);
  });

  // Swipe Kiri / Kanan di HP
  var touchStartX = 0;
  var touchEndX = 0;
  var viewportEl = document.getElementById("slides-viewport");
  if (viewportEl) {
    viewportEl.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    viewportEl.addEventListener(
      "touchend",
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      },
      { passive: true }
    );
  }

  // Koordinasi pintar antara musik latar & video saat video berputar
  var surpriseVid = document.getElementById("surprise-video");
  if (surpriseVid) {
    surpriseVid.addEventListener("play", function () {
      isVideoPlaying = true;
      if (bgAudio && !bgAudio.paused) {
        bgAudio.volume = 0.22;
      }
      if (slideTimer) clearTimeout(slideTimer);
      if (progressAnimFrame) cancelAnimationFrame(progressAnimFrame);
    });
    surpriseVid.addEventListener("pause", function () {
      isVideoPlaying = false;
      if (bgAudio && !bgAudio.paused) {
        bgAudio.volume = 0.78;
      }
      restartAutoSlideTimer();
    });
    surpriseVid.addEventListener("ended", function () {
      isVideoPlaying = false;
      if (bgAudio && !bgAudio.paused) {
        bgAudio.volume = 0.78;
      }
      nextSlide();
    });
  }

  /* =====================================================
     PENAMPIL MANDIRI (LIGHTBOX) SAAT FOTO DIKLIK
     ===================================================== */
  $(".memory-slide").on("click", function (e) {
    if ($(e.target).closest(".standalone-link").length) return;
    if ($(e.target).is("video")) return;

    var card = $(this);
    var type = card.data("type");
    var src = card.data("src");
    var title = card.data("title");
    var caption = card.data("caption");

    var stage = $("#lightbox-stage");
    stage.empty();

    if (surpriseVid && !surpriseVid.paused) {
      surpriseVid.pause();
    }

    if (type === "video") {
      stage.append(
        '<video controls autoplay playsinline><source src="' + src + '" type="video/mp4" /></video>'
      );
    } else {
      stage.append('<img src="' + src + '" alt="' + title + '" />');
    }

    $("#lightbox-title").text(title);
    $("#lightbox-caption").text(caption);
    $("#lightbox-direct-link").attr("href", src);
    $("#lightbox-modal").addClass("open").attr("aria-hidden", "false");
  });

  function closeLightbox() {
    $("#lightbox-stage").empty();
    $("#lightbox-modal").removeClass("open").attr("aria-hidden", "true");
  }

  $("#lightbox-close, #lightbox-backdrop").on("click", function () {
    closeLightbox();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $("#lightbox-modal").hasClass("open")) {
      closeLightbox();
    }
  });

  /* =====================================================
     KANVAS PARTIKEL LATAR ROMANTIS (MURNI TANPA EMOJI)
     ===================================================== */
  var canvas = document.getElementById("romantic-canvas");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var burstParticles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function createFloatingParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: 5 + Math.random() * 9,
      speedY: 0.35 + Math.random() * 0.75,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.16 + Math.random() * 0.38,
      color: Math.random() > 0.35 ? "#fb7185" : "#fde68a",
    };
  }

  for (var i = 0; i < 28; i++) {
    var p = createFloatingParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function spawnCelebrationHearts(count) {
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight * 0.55;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 1.8 + Math.random() * 6.2;
      burstParticles.push({
        x: cx + (Math.random() - 0.5) * 140,
        y: cy + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: 7 + Math.random() * 12,
        alpha: 1,
        color: ["#f43f5e", "#fb7185", "#fde68a", "#e879f9"][Math.floor(Math.random() * 4)],
      });
    }
  }

  function drawHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    var topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(
      -size / 2,
      (size + topCurveHeight) / 2,
      0,
      (size + topCurveHeight) / 1.4,
      0,
      size
    );
    ctx.bezierCurveTo(
      0,
      (size + topCurveHeight) / 1.4,
      size / 2,
      (size + topCurveHeight) / 2,
      size / 2,
      topCurveHeight
    );
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var pt = particles[i];
      pt.y -= pt.speedY;
      pt.x += pt.speedX;
      if (pt.y < -30) {
        particles[i] = createFloatingParticle();
      }
      drawHeart(pt.x, pt.y, pt.size, pt.color, pt.opacity);
    }

    for (var j = burstParticles.length - 1; j >= 0; j--) {
      var bp = burstParticles[j];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += 0.09;
      bp.alpha -= 0.015;
      if (bp.alpha <= 0) {
        burstParticles.splice(j, 1);
      } else {
        drawHeart(bp.x, bp.y, bp.size, bp.color, bp.alpha);
      }
    }

    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();
});
