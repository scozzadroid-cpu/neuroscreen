'use strict';
// Language toggle for static pages (docs.html, info.html).
// Detection runs inline in <head> to avoid flash; this file handles the toggle button.

function __setStaticLang(lang) {
  if (lang !== 'it' && lang !== 'en') return;
  document.documentElement.lang = lang;
  try { localStorage.setItem('ns_pref_lang', lang); } catch(e) {}
  document.querySelectorAll('.lang-btn[data-lang]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var lang = document.documentElement.lang || 'it';
  document.querySelectorAll('.lang-btn[data-lang]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
});
