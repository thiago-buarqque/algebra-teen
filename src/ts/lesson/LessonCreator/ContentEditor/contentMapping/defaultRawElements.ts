export const DEFAULT_HTML_ELEMENTS: { [key: string]: string } = {
  "<h3/>": '\n<h3 class="lesson-subheading subheading"></h3>',
  "<p/>": '\n<p class="lesson-paragraph"></p>',
  "<equacao/>": '\n<span class="lesson-equation" latex=""></span>',
  "<textEquacao/>": '\n<span class="lesson-text-equation"></span>',
  "<interacao/>":
    '\n<button id="interaction-$[id]" class="tertiary-button lesson-interaction">$[interact.svg]<span>LABEL</span></button>',
  "<pergunta/>": `
    \n  <!-- [Id da pergunta, "enunciado", "resposta correta", [...demais opcoes]] -->
        <question>[
          "$[id]",
          "Enunciado da questao",
          "OPCAO CORRETA",
          "OPCAO 2"
        ]</question>

        <div id="$[id]-question-explanation" class="question-explanation invisible-element">
          <div class="content shadowed-element">
            <div class="header">
              <button id="btn-close-explanation-$[id]" class="question-explanation-close-button">$[close.svg]</button>
            </div>
            // content
          </div>
        </div>
    `,
  "<caixaEquacao/>": `
      <input class="lesson-question-input squared"/>
    `,
  "<botao/>": `\n<button onclick="myFunc()" class="primary-button"><span>LABEL</span></button>
    `,
};
