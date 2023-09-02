import { generateRandomId } from "../../util";
import { DEFAULT_HTML_ELEMENTS } from "./defaultRawElements";
import { DEFAULT_HTML_ELEMENT_SCRIPTS } from "./defaultRawScripts";

export const getDefaultRawElement = (tag: string) => {
  const id = generateRandomId();

  const html = DEFAULT_HTML_ELEMENTS[tag]
  const script = DEFAULT_HTML_ELEMENT_SCRIPTS[tag] || ""
    
  return { html: html.replaceAll("$[id]", id), script: script.replaceAll("$[id]", id) };
};

