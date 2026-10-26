// scripts/downloadClips.ts — Download native Romanian TTS audio clips into public/audio/
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const AUDIO_DIR = path.resolve(process.cwd(), 'public/audio');

const CLIPS: Record<string, string> = {
  // Grădina cu Genuri
  'word_casa.mp3': 'casă',
  'phrase_casa.mp3': 'o casă, două case',
  'word_tren.mp3': 'tren',
  'phrase_tren.mp3': 'un tren, două trenuri',
  'word_caine.mp3': 'câine',
  'phrase_caine.mp3': 'un câine, doi câini',
  'word_scaun.mp3': 'scaun',
  'phrase_scaun.mp3': 'un scaun, două scaune',
  'word_carte.mp3': 'carte',
  'phrase_carte.mp3': 'o carte, două cărți',
  'word_pom.mp3': 'pom',
  'phrase_pom.mp3': 'un pom, doi pomi',

  // Podul Cui
  'cas_casa_bunicii.mp3': 'casa bunicii',
  'cas_mamei.mp3': 'I-am dat mărul mamei',
  'cas_fetei.mp3': 'cartea fetei',
  'cas_baiatului.mp3': 'mingea băiatului',

  // Vânătorul de Englezisme
  'clq_am_8_ani.mp3': 'Am 8 ani',
  'clq_are_sens.mp3': 'Are sens',
  'clq_mi_e_frig.mp3': 'Mi-e frig',
  'clq_dus.mp3': 'Am făcut un duș',

  // Moara cu Articole
  'art_cainele.mp3': 'câinele',
  'art_pe_masa.mp3': 'pe masă',
  'art_baiatul.mp3': 'băiatul',
  'art_cartea.mp3': 'cartea',

  // Poteca lui Să
  'sub_vreau_sa_merg.mp3': 'Vreau să merg afară',
  'sub_trebuie_sa_mananc.mp3': 'Trebuie să mănânc supa',
  'sub_pot_sa_ajut.mp3': 'Eu pot să te ajut',
  'sub_place_sa_desenez.mp3': 'Îmi place să desenez',

  // Fântâna Posesivelor
  'pos_prieten_al_meu.mp3': 'un prieten al meu',
  'pos_carte_a_mea.mp3': 'o carte a mea',
  'pos_colegii_ai_mei.mp3': 'colegii ai mei',
  'pos_jucariile_ale_mele.mp3': 'jucăriile ale mele',

  // Târgul de Numere
  'num_20_de_mere.mp3': 'douăzeci de mere',
  'num_5_carti.mp3': 'cinci cărți',
  'num_35_de_oite.mp3': 'treizeci și cinci de oițe',
  'num_12_prieteni.mp3': 'doisprezece prieteni',

  // Ecoul din Munte (CLI)
  'cli_pe_ion.mp3': 'L-am văzut pe Ion în parc',
  'cli_pe_maria.mp3': 'Am chemat-o pe Maria ieri',
  'cli_pe_tata.mp3': 'Îl aștept pe tata la școală',
  'cli_pe_bunica.mp3': 'O ajut pe bunica în grădină',
  'cli_pe_baieti.mp3': 'Îi aud pe băieți jucând fotbal',

  // Atelierul de Culori (AGR & ORD)
  'agr_masina_rosie.mp3': 'o mașină roșie',
  'agr_caini_albi.mp3': 'doi câini albi',
  'ord_creionul_albastru.mp3': 'creionul albastru',
  'agr_mere_verzi.mp3': 'trei mere verzi',
  'ord_casa_frumoasa.mp3': 'casa frumoasă',

  // Feedback & Greetings
  'greet_mascot.mp3': 'Bună, Tudor! Eu sunt Miorița.',
  'bravo.mp3': 'Bravo, Tudor!',
  'minunat.mp3': 'Minunat! Foarte bine!',
  'incearca.mp3': 'Aproape! Încearcă din nou!'
};

function downloadClip(filename: string, text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dest = path.join(AUDIO_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`✓ Exists: ${filename}`);
      return resolve();
    }

    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ro&client=tw-ob&q=${encoded}`;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${filename}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded [ro]: ${filename} -> "${text}" (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  console.log(`Downloading ${Object.keys(CLIPS).length} native Romanian audio clips...`);

  for (const [filename, text] of Object.entries(CLIPS)) {
    try {
      await downloadClip(filename, text);
      // Small pause to be gentle
      await new Promise(r => setTimeout(r, 120));
    } catch (err: any) {
      console.error(`Failed ${filename}: ${err.message}`);
    }
  }

  console.log('Finished downloading clips.');
}

main().catch(console.error);
