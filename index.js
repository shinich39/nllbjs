import py from "./src/py.js";
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
// https://github.com/facebookresearch/flores/blob/main/flores200/README.md
const LANGS = JSON.parse(fs.readFileSync(path.join(__dirname, "langs", "flores.json")));
const LANG_LIST = Object.keys(LANGS);

function isValidLanguage(str) {
  return LANG_LIST.indexOf(str) > -1;
}

function convertLanguage(str) {
  return LANGS[str];
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

  from = convertLanguage(from);
  to = convertLanguage(to);

  const model = MODELS[modelIndex || 0];
  const {stdout, stderr} = await py.exec(MAIN_PATH, [model,text,from,to,]);
  if (stdout === "" && stderr.length > 0) {
    throw new Error(stderr);
  }
  return stdout;
}

export default {
  init,
  exec,
}
