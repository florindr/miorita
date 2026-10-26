// public/sw.js — Service Worker for Miorița Offline PWA
const CACHE_NAME = 'miorita-cache-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/art/mascot.jpg',
  '/art/moodboard.jpg',
  '/art/village.jpg',
  '/audio/word_casa.mp3',
  '/audio/phrase_casa.mp3',
  '/audio/word_tren.mp3',
  '/audio/phrase_tren.mp3',
  '/audio/word_caine.mp3',
  '/audio/phrase_caine.mp3',
  '/audio/word_scaun.mp3',
  '/audio/phrase_scaun.mp3',
  '/audio/word_carte.mp3',
  '/audio/phrase_carte.mp3',
  '/audio/word_pom.mp3',
  '/audio/phrase_pom.mp3',
  '/audio/cas_casa_bunicii.mp3',
  '/audio/cas_mamei.mp3',
  '/audio/cas_fetei.mp3',
  '/audio/cas_baiatului.mp3',
  '/audio/clq_am_8_ani.mp3',
  '/audio/clq_are_sens.mp3',
  '/audio/clq_mi_e_frig.mp3',
  '/audio/clq_dus.mp3',
  '/audio/art_cainele.mp3',
  '/audio/art_pe_masa.mp3',
  '/audio/art_baiatul.mp3',
  '/audio/art_cartea.mp3',
  '/audio/sub_vreau_sa_merg.mp3',
  '/audio/sub_trebuie_sa_mananc.mp3',
  '/audio/sub_pot_sa_ajut.mp3',
  '/audio/sub_place_sa_desenez.mp3',
  '/audio/pos_prieten_al_meu.mp3',
  '/audio/pos_carte_a_mea.mp3',
  '/audio/pos_colegii_ai_mei.mp3',
  '/audio/pos_jucariile_ale_mele.mp3',
  '/audio/num_20_de_mere.mp3',
  '/audio/num_5_carti.mp3',
  '/audio/num_35_de_oite.mp3',
  '/audio/num_12_prieteni.mp3',
  '/audio/cli_pe_ion.mp3',
  '/audio/cli_pe_maria.mp3',
  '/audio/cli_pe_tata.mp3',
  '/audio/cli_pe_bunica.mp3',
  '/audio/cli_pe_baieti.mp3',
  '/audio/agr_masina_rosie.mp3',
  '/audio/agr_caini_albi.mp3',
  '/audio/ord_creionul_albastru.mp3',
  '/audio/agr_mere_verzi.mp3',
  '/audio/ord_casa_frumoasa.mp3',
  '/audio/greet_mascot.mp3',
  '/audio/bravo.mp3',
  '/audio/minunat.mp3',
  '/audio/incearca.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and chrome-extension/data URLs
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Audio & Images: Cache-first
  if (url.pathname.startsWith('/audio/') || url.pathname.startsWith('/art/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Application code: Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkRes) => {
        if (networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkRes;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
