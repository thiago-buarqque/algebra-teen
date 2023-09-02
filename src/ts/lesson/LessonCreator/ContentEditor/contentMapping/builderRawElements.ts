export const BUILDER_RAW_HTML_SUBELEMENTS: { [key: string]: string } = {
  "<opcao/>": `<li class="question-element-option">
    <input id="question-$[id]-option-$[value]" type="checkbox" class="question-$[id]-option" style="display:none;" value="$[value]"/>
    <button type="button" class="question-option-visual question-$[id]-option-visual" id="question-$[id]-option-$[value]-visual" input-id="question-$[id]-option-$[value]"></button>
    <label for="question-$[id]-option-$[value]" id="question-$[id]-option-$[value]-label">$[label]</label>
    </li>`,
  "<pergunta/>": `
    <form class="question-element" id="question-$[id]" method="post" right-answer="$[$[id]-right-answer]">
      <p class="question-statement">$[question-statement]</p>
      <ul>
        $[question-options]
      </ul>
      <button type="submit" class="question-element-submit-btn tertiary-button small">$[answer.svg]<span>Responder</span></button>
      <span class="question-feedback success" style="display: none">👏 Você acertou!</span>
      <span class="question-feedback failure" style="display: none">😔 Você errou.</span>
      <button type="button" id="btn-open-explanation-question-$[id]" style="display: none;" class="question-explanation-button">$[question-mark]<span>Explicação</span></button>
    </form>
  `,
  "<pergunta-questao/>": `<p class="question-statement">$[content]</p>`
};
