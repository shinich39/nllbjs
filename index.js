import py from "./py.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAIN_PATH = path.join(__dirname, "src", "main.py");

// https://huggingface.co/facebook
const MODELS = [
  'facebook/nllb-200-distilled-600M',
  'facebook/nllb-200-distilled-1.3B',
  'facebook/nllb-200-1.3B',
  'facebook/nllb-200-3.3B',
  'facebook/nllb-moe-54b',
  'nllb-finetuned-en2ko', // english to korean model
];

// https://huggingface.co/facebook/nllb-200-distilled-600M/blob/main/README.md?code=true
const LANGS = ["ace","acm","acq","aeb","af","ajp","ak","als","am","apc","ar","ars","ary","arz","as","ast","awa","ayr","azb","azj","ba","bm","ban","be","bem","bn","bho","bjn","bo","bs","bug","bg","ca","ceb","cs","cjk","ckb","crh","cy","da","de","dik","dyu","dz","el","en","eo","et","eu","ee","fo","fj","fi","fon","fr","fur","fuv","gaz","gd","ga","gl","gn","gu","ht","ha","he","hi","hne","hr","hu","hy","ig","ilo","id","is","it","jv","ja","kab","kac","kam","kn","ks","ka","kk","kbp","kea","khk","km","ki","rw","ky","kmb","kmr","knc","kg","ko","lo","lij","li","ln","lt","lmo","ltg","lb","lua","lg","luo","lus","lvs","mag","mai","ml","mar","min","mk","mt","mni","mos","mi","my","nl","nn","nb","npi","nso","nus","ny","oc","ory","pag","pa","pap","pbt","pes","plt","pl","pt","prs","quy","ro","rn","ru","sg","sa","sat","scn","shn","si","sk","sl","sm","sn","sd","so","st","es","sc","sr","ss","su","sv","swh","szl","ta","taq","tt","te","tg","tl","th","ti","tpi","tn","ts","tk","tum","tr","tw","tzm","ug","uk","umb","ur","uzn","vec","vi","war","wo","xh","ydd","yo","yue","zh","zsm","zu",];
const LANG_DETAILS = ["ace_Arab","ace_Latn","acm_Arab","acq_Arab","aeb_Arab","afr_Latn","ajp_Arab","aka_Latn","amh_Ethi","apc_Arab","arb_Arab","ars_Arab","ary_Arab","arz_Arab","asm_Beng","ast_Latn","awa_Deva","ayr_Latn","azb_Arab","azj_Latn","bak_Cyrl","bam_Latn","ban_Latn","bel_Cyrl","bem_Latn","ben_Beng","bho_Deva","bjn_Arab","bjn_Latn","bod_Tibt","bos_Latn","bug_Latn","bul_Cyrl","cat_Latn","ceb_Latn","ces_Latn","cjk_Latn","ckb_Arab","crh_Latn","cym_Latn","dan_Latn","deu_Latn","dik_Latn","dyu_Latn","dzo_Tibt","ell_Grek","eng_Latn","epo_Latn","est_Latn","eus_Latn","ewe_Latn","fao_Latn","pes_Arab","fij_Latn","fin_Latn","fon_Latn","fra_Latn","fur_Latn","fuv_Latn","gla_Latn","gle_Latn","glg_Latn","grn_Latn","guj_Gujr","hat_Latn","hau_Latn","heb_Hebr","hin_Deva","hne_Deva","hrv_Latn","hun_Latn","hye_Armn","ibo_Latn","ilo_Latn","ind_Latn","isl_Latn","ita_Latn","jav_Latn","jpn_Jpan","kab_Latn","kac_Latn","kam_Latn","kan_Knda","kas_Arab","kas_Deva","kat_Geor","knc_Arab","knc_Latn","kaz_Cyrl","kbp_Latn","kea_Latn","khm_Khmr","kik_Latn","kin_Latn","kir_Cyrl","kmb_Latn","kon_Latn","kor_Hang","kmr_Latn","lao_Laoo","lvs_Latn","lij_Latn","lim_Latn","lin_Latn","lit_Latn","lmo_Latn","ltg_Latn","ltz_Latn","lua_Latn","lug_Latn","luo_Latn","lus_Latn","mag_Deva","mai_Deva","mal_Mlym","mar_Deva","min_Latn","mkd_Cyrl","plt_Latn","mlt_Latn","mni_Beng","khk_Cyrl","mos_Latn","mri_Latn","zsm_Latn","mya_Mymr","nld_Latn","nno_Latn","nob_Latn","npi_Deva","nso_Latn","nus_Latn","nya_Latn","oci_Latn","gaz_Latn","ory_Orya","pag_Latn","pan_Guru","pap_Latn","pol_Latn","por_Latn","prs_Arab","pbt_Arab","quy_Latn","ron_Latn","run_Latn","rus_Cyrl","sag_Latn","san_Deva","sat_Beng","scn_Latn","shn_Mymr","sin_Sinh","slk_Latn","slv_Latn","smo_Latn","sna_Latn","snd_Arab","som_Latn","sot_Latn","spa_Latn","als_Latn","srd_Latn","srp_Cyrl","ssw_Latn","sun_Latn","swe_Latn","swh_Latn","szl_Latn","tam_Taml","tat_Cyrl","tel_Telu","tgk_Cyrl","tgl_Latn","tha_Thai","tir_Ethi","taq_Latn","taq_Tfng","tpi_Latn","tsn_Latn","tso_Latn","tuk_Latn","tum_Latn","tur_Latn","twi_Latn","tzm_Tfng","uig_Arab","ukr_Cyrl","umb_Latn","urd_Arab","uzn_Latn","vec_Latn","vie_Latn","war_Latn","wol_Latn","xho_Latn","ydd_Hebr","yor_Latn","yue_Hant","zho_Hans","zho_Hant","zul_Latn",]

function isValidLanguage(str) {
  return LANGS.indexOf(str) > -1 || LANG_DETAILS.indexOf(str) > -1;
}

function isValidModelIndex(i) {
  return !!MODELS[i || 0];
}

async function init(force) {
  await py.venv(force);
  await py.install("torch", ["--index-url", "https://download.pytorch.org/whl/cu118"]);
  await py.install("transformers");
}

async function exec(text, from, to, modelIndex) {
  if (!isValidLanguage(from)) {
    throw new Error(`${from} is invalid language.`);
  }
  if (!isValidLanguage(to)) {
    throw new Error(`${to} is invalid language.`);
  }
  if (!isValidModelIndex(modelIndex)) {
    throw new Error(`${(modelIndex || 0)} is invalid modelIndex.`);
  }

  const model = MODELS[modelIndex || 0];
  const {stdout, stderr} = await py.exec(MAIN_PATH, [model,text,from,to,]);
  return stdout;
}

export default {
  init,
  exec,
}
