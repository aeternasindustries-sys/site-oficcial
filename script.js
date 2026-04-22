(() => {
  const countdownRoot = document.querySelector('[data-countdown]');
  if (!countdownRoot) return;

  const targetValue = countdownRoot.getAttribute('data-target');
  const targetDate = new Date(targetValue);
  if (Number.isNaN(targetDate.getTime())) return;

  const units = {
    days: countdownRoot.querySelector('[data-unit="days"]'),
    hours: countdownRoot.querySelector('[data-unit="hours"]'),
    minutes: countdownRoot.querySelector('[data-unit="minutes"]'),
    seconds: countdownRoot.querySelector('[data-unit="seconds"]')
  };

  const subtitle = document.querySelector('.countdown-date');

  const pad = (value) => String(value).padStart(2, '0');

  const paintUnit = (node, value) => {
    if (!node) return;
    const next = pad(value);
    if (node.textContent !== next) {
      node.textContent = next;
      node.classList.add('is-updating');
      window.setTimeout(() => node.classList.remove('is-updating'), 160);
    }
  };

  const update = () => {
    const now = new Date();
    let delta = targetDate.getTime() - now.getTime();

    if (delta <= 0) {
      paintUnit(units.days, 0);
      paintUnit(units.hours, 0);
      paintUnit(units.minutes, 0);
      paintUnit(units.seconds, 0);
      if (subtitle) subtitle.textContent = 'Now';
      return;
    }

    const dayMs = 24 * 60 * 60 * 1000;
    const hourMs = 60 * 60 * 1000;
    const minuteMs = 60 * 1000;

    const days = Math.floor(delta / dayMs);
    delta -= days * dayMs;
    const hours = Math.floor(delta / hourMs);
    delta -= hours * hourMs;
    const minutes = Math.floor(delta / minuteMs);
    delta -= minutes * minuteMs;
    const seconds = Math.floor(delta / 1000);

    paintUnit(units.days, days);
    paintUnit(units.hours, hours);
    paintUnit(units.minutes, minutes);
    paintUnit(units.seconds, seconds);
  };

  update();
  window.setInterval(update, 1000);
})();

(() => {
  const banner = document.querySelector('[data-cookie-banner]');
  if (!banner) return;

  const acceptButton = banner.querySelector('[data-cookie-accept]');
  const dismissButton = banner.querySelector('[data-cookie-dismiss]');
  const cookieName = 'aeterna_cookie_notice';
  const maxAge = 60 * 60 * 24 * 365;

  const getCookie = (name) => {
    const parts = document.cookie ? document.cookie.split('; ') : [];
    const entry = parts.find((item) => item.startsWith(`${name}=`));
    return entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : '';
  };

  const setCookie = (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  };

  const hideBanner = () => {
    banner.hidden = true;
  };

  const rememberChoice = (choice) => {
    setCookie(cookieName, choice);
    hideBanner();
  };

  const savedChoice = getCookie(cookieName);
  if (savedChoice) {
    hideBanner();
  } else {
    banner.hidden = false;
  }

  acceptButton?.addEventListener('click', () => rememberChoice('accepted'));
  dismissButton?.addEventListener('click', () => rememberChoice('essential'));
})();
