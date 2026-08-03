(function () {
  const localHosts = new Set(["localhost", "127.0.0.1", "::1", ""]);
  window.TUPA_CONFIG = Object.freeze({
    API_BASE_URL: localHosts.has(window.location.hostname)
      ? "http://127.0.0.1:5000"
      : "https://tupa-unsaac-api.onrender.com",
  });
})();
