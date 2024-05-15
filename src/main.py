import sys
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# set stdout encoding
sys.stdout.reconfigure(encoding='utf-8')

def main(*args):
  model_name = args[0]
  text = args[1]
  src_lang = args[2]
  tgt_lang = args[3]

  tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="./models", src_lang=src_lang)
  model = AutoModelForSeq2SeqLM.from_pretrained(model_name, cache_dir="./models")
  inputs = tokenizer(text=text, return_tensors="pt")
  translated_tokens = model.generate(**inputs, forced_bos_token_id=tokenizer.lang_code_to_id[tgt_lang], max_length=512)
  output = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]

  # error ocurred
  # translator = pipeline('translation', tokenizer=tokenizer, model=model, device=0, src_lang=src_lang, tgt_lang=tgt_lang, max_length=512)
  # output = translator(text, max_length=512)

  sys.stdout.write(output)
  sys.exit(0)

if __name__ == '__main__':
  main(*sys.argv[1:])