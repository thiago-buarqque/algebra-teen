import { BUILDER_RAW_HTML_SUBELEMENTS } from "../LessonCreator/ContentEditor/contentMapping/builderRawElements";
import { BUILDER_RAW_HTML_ELEMENT_SCRIPTS } from "../LessonCreator/ContentEditor/contentMapping/builderRawScripts";

export default class QuestionBuilder {
  static getFromBetween(string: string, sub1: string, sub2: string) {
    if (string.indexOf(sub1) < 0 || string.indexOf(sub2) < 0) return false;

    let SP = string.indexOf(sub1) + sub1.length;

    let string1 = string.substr(0, SP);
    let string2 = string.substr(SP);

    let TP = string1.length + string2.indexOf(sub2);

    return string.substring(SP, TP);
  }
  static buildBody(options: string[], html: string, sub1: string, sub2: string) {
    if (html.indexOf(sub1) < 0 || html.indexOf(sub2) < 0) return false;

    let strOptions: string = "";

    let strQuestionBody = BUILDER_RAW_HTML_SUBELEMENTS["<pergunta/>"];

    const questionId = options[0];

    strQuestionBody = strQuestionBody.replaceAll("$[id]", questionId);

    const questionStatement = options[1];
    
    strQuestionBody = strQuestionBody.replaceAll("$[question-statement]", questionStatement);

    ({ strQuestionBody, strOptions } = QuestionBuilder.getRawOptions(options, questionId, strQuestionBody, strOptions));

    strQuestionBody = strQuestionBody.replaceAll("$[question-options]", strOptions);

    let removal = sub1 + this.getFromBetween(html, sub1, sub2) + sub2;

    return html.replace(removal, strQuestionBody);
  }
  
  private static getRawOptions(options: string[], questionId: string, strQuestionBody: string, strOptions: string) {
    let rawOptions: string[] = [];

    options.forEach((value, i) => {
      if (i > 1) {
        let strOption = BUILDER_RAW_HTML_SUBELEMENTS["<opcao/>"];
        strOption = strOption.replaceAll("$[value]", ""+i);
        strOption = strOption.replaceAll("$[label]", value);
        strOption = strOption.replaceAll("$[id]", questionId);
        rawOptions.push(strOption);
      }

      if (i === 2) {
        strQuestionBody = strQuestionBody.replace(`$[${questionId}-right-answer]`, ""+i);
      }
    });

    rawOptions = rawOptions.sort(() => 0.5 - Math.random());
    rawOptions.forEach((option) => {
      strOptions += "\n" + option;
    });

    return { strQuestionBody, strOptions };
  }

  static buildQuestionContent(
    content: string,
    sub1: string,
    sub2: string,
    script: boolean
  ): string | undefined {
    if (content.indexOf(sub1) < 0 || content.indexOf(sub2) < 0) return content;

    let result = this.getFromBetween(content, sub1, sub2);

    try {
      // @ts-ignore
      const args = JSON.parse(result);
      if (script) {
        content = this.buildScript(args, content, sub1, sub2) || content;
      } else {
        content = this.buildBody(args, content, sub1, sub2) || content;
      }

      if (content.indexOf(sub1) > -1 && content.indexOf(sub2) > -1) {
        return this.buildQuestionContent(content, sub1, sub2, script);
      } else {
        return content;
      }
    } catch {
      return undefined;
    }
  }
  static buildScript(options: string[], string: string, sub1: string, sub2: string) {
    if (string.indexOf(sub1) < 0 || string.indexOf(sub2) < 0) return false;

    const questionId = options[0];

    let strScript = BUILDER_RAW_HTML_ELEMENT_SCRIPTS["<pergunta/>"];
    strScript = strScript.replaceAll("$[id]", questionId);
    strScript = strScript.replaceAll("$[onSubmitCode]", options[1] || "");

    let removal = sub1 + this.getFromBetween(string, sub1, sub2) + sub2;

    return string.replace(removal, strScript);
  }
}
