/* eslint-disable */ 
export const DEFAULT_HTML_ELEMENT_SCRIPTS: { [key: string]: string } = {
  "<interacao/>": `
  document.getElementById("interaction-$[id]").onclick = (e) => {
    e.currentTarget.disabled = true;

    const interactiveQuestionElement = document.getElementById("interactive-lesson");

    const alreadyCompleted = e.currentTarget.getAttribute("already-completed")

    interactiveQuestionElement.setAttribute("actions", \`{"enableNextButton": "true", "stepForward": \$\{!alreadyCompleted ? "true" : "false"\}}\`);
    interactiveQuestionElement.setAttribute("completed-interaction", \`{"id": "interaction-$[id]"}\`);

    // seu codigo aqui
  }
  `,
  "<pergunta/>": `<question-script>["$[id]"]</question-script>`,
};
