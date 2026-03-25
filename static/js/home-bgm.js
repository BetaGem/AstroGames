(() => {
  const bgmToggle = document.getElementById("bgmToggle");
  if (!bgmToggle) {
    return;
  }

  const bgmUrl = bgmToggle.dataset.bgmUrl;
  const loopCrossfadeSeconds = 2.8;
  const bgmLoopStartSeconds = 1.15;
  const bgmLoopEndTrimSeconds = 1.85;

  let bgmPlayers = [];
  let activePlayerIndex = 0;
  let isPlaying = false;
  let isLoadingBgm = false;

  function syncBgmUi(playing) {
    bgmToggle.classList.toggle("playing", playing);
    bgmToggle.setAttribute("aria-pressed", String(playing));
    bgmToggle.setAttribute("aria-label", playing ? "暂停背景音乐" : "播放背景音乐");
    bgmToggle.setAttribute("title", playing ? "暂停背景音乐" : "播放背景音乐");
  }

  function detachLoopHooks(player) {
    if (!player) {
      return;
    }
    if (player.__crossfadeTimeUpdate) {
      player.removeEventListener("timeupdate", player.__crossfadeTimeUpdate);
      player.__crossfadeTimeUpdate = null;
    }
    if (player.__crossfadeEnded) {
      player.removeEventListener("ended", player.__crossfadeEnded);
      player.__crossfadeEnded = null;
    }
  }

  function stopBgmPlayback() {
    for (const player of bgmPlayers) {
      detachLoopHooks(player);
      if (player.__fadeInterval) {
        window.clearInterval(player.__fadeInterval);
        player.__fadeInterval = null;
      }
      player.pause();
      player.currentTime = bgmLoopStartSeconds;
      player.volume = 0;
    }
  }

  function fadeVolume(player, from, to, durationSeconds, onComplete) {
    if (player.__fadeInterval) {
      window.clearInterval(player.__fadeInterval);
      player.__fadeInterval = null;
    }

    const durationMs = Math.max(120, durationSeconds * 1000);
    const stepMs = 60;
    const startedAt = Date.now();
    player.volume = from;

    player.__fadeInterval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      player.volume = from + (to - from) * progress;

      if (progress >= 1 || !isPlaying) {
        window.clearInterval(player.__fadeInterval);
        player.__fadeInterval = null;
        player.volume = to;
        if (progress >= 1 && onComplete) {
          onComplete();
        }
      }
    }, stepMs);
  }

  function armCrossfade(currentIndex) {
    if (!isPlaying || bgmPlayers.length < 2 || currentIndex < 0) {
      return;
    }

    const current = bgmPlayers[currentIndex];
    const nextIndex = (currentIndex + 1) % bgmPlayers.length;
    const next = bgmPlayers[nextIndex];
    const effectiveDuration = Math.max(1, current.duration - bgmLoopStartSeconds - bgmLoopEndTrimSeconds);
    const safeCrossfade = Math.min(loopCrossfadeSeconds, Math.max(0.45, effectiveDuration * 0.35));
    const crossfadeStart = Math.max(
      bgmLoopStartSeconds + 0.2,
      bgmLoopStartSeconds + effectiveDuration - safeCrossfade
    );
    let crossfadeTriggered = false;

    const triggerCrossfade = async () => {
      if (crossfadeTriggered || !isPlaying) {
        return;
      }
      crossfadeTriggered = true;
      detachLoopHooks(current);

      next.currentTime = bgmLoopStartSeconds;
      next.volume = 0;
      try {
        await next.play();
      } catch (error) {
        isPlaying = false;
        stopBgmPlayback();
        syncBgmUi(false);
        return;
      }

      fadeVolume(current, current.volume || 0.32, 0, safeCrossfade, () => {
        current.pause();
        current.currentTime = bgmLoopStartSeconds;
        current.volume = 0;
      });
      fadeVolume(next, 0, 0.32, safeCrossfade);

      activePlayerIndex = nextIndex;
      armCrossfade(nextIndex);
    };

    current.__crossfadeTimeUpdate = () => {
      if (current.currentTime >= crossfadeStart) {
        triggerCrossfade();
      }
    };
    current.__crossfadeEnded = () => {
      triggerCrossfade();
    };

    current.addEventListener("timeupdate", current.__crossfadeTimeUpdate);
    current.addEventListener("ended", current.__crossfadeEnded);
  }

  async function ensureBgmReady() {
    if (bgmPlayers.length || isLoadingBgm) {
      while (isLoadingBgm) {
        await new Promise((resolve) => window.setTimeout(resolve, 40));
      }
      return;
    }

    isLoadingBgm = true;
    try {
      bgmPlayers = [new Audio(bgmUrl), new Audio(bgmUrl)];
      await Promise.all(
        bgmPlayers.map(
          (player) =>
            new Promise((resolve, reject) => {
              player.preload = "auto";
              player.loop = false;
              player.volume = 0;
              player.addEventListener("loadedmetadata", resolve, { once: true });
              player.addEventListener("error", reject, { once: true });
              player.load();
            })
        )
      );
    } finally {
      isLoadingBgm = false;
    }
  }

  bgmToggle.addEventListener("click", async () => {
    if (!isPlaying) {
      try {
        await ensureBgmReady();
        if (!bgmPlayers.length) {
          syncBgmUi(false);
          return;
        }

        isPlaying = true;
        stopBgmPlayback();
        activePlayerIndex = 0;
        bgmPlayers[0].currentTime = bgmLoopStartSeconds;
        bgmPlayers[0].volume = 0;
        await bgmPlayers[0].play();
        fadeVolume(bgmPlayers[0], 0, 0.32, 1.2);
        armCrossfade(0);
        syncBgmUi(true);
      } catch (error) {
        isPlaying = false;
        stopBgmPlayback();
        syncBgmUi(false);
      }
    } else {
      isPlaying = false;
      stopBgmPlayback();
      syncBgmUi(false);
    }
  });
})();
