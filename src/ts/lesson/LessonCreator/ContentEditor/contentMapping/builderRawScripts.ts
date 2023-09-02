/* eslint-disable */ 
export const BUILDER_RAW_HTML_ELEMENT_SCRIPTS: { [key: string]: string } = {
  "<pergunta/>": `
      function handleOptionSelect$[id](e) {
        const questionElement = document.getElementById("question-$[id]");

        if(questionElement.classList.contains("question-success") ||
           questionElement.classList.contains("question-failure")) return;

        Array.from(document.querySelectorAll(".question-$[id]-option-visual")).forEach(el => el.classList.remove("checked"))

        e.target.classList.add("checked");
  
        Array.from(document.querySelectorAll(".question-$[id]-option")).forEach(el => el.checked = false)

        document.getElementById(e.target.getAttribute("input-id")).checked = true
      }
  
      Array.from(document.querySelectorAll(".question-$[id]-option-visual")).forEach(el => {
        el.onclick = handleOptionSelect$[id]
      });
  
      document.getElementById("question-$[id]").onsubmit = (e) => {
        e.preventDefault();

        const strRightAnswer = e.target.getAttribute("right-answer")
         
        const checkboxes = Array.from(document.querySelectorAll(".question-$[id]-option"))
  
        if(!checkboxes.some(checkbox => checkbox.checked)) return;
  
        let userAnswer = ""
        let userAnswerLabel = ""
        const rightAnswer = checkboxes.some(el => {
          if(el.checked) {
            userAnswer = el.value;
            userAnswerLabel = document.getElementById("question-$[id]-option-" + userAnswer + "-label").innerHTML
          }
          return el.checked && strRightAnswer === el.value
        });
        
        const interactiveQuestionElement = document.getElementById("interactive-lesson");

        if(rightAnswer) {
          e.target.classList.add("question-success");
          interactiveQuestionElement.setAttribute("question-completion", \`{"id": "$[id]", "status": "success", "userAnswer": "\$\{userAnswer\}"}\`);
        }
        else {
          e.target.classList.add("question-failure");
          interactiveQuestionElement.setAttribute("question-completion", \`{"id": "$[id]", "status": "failure", "userAnswer": "\$\{userAnswer\}"}\`);
        }

        const btnCloseExplanation = document.getElementById("btn-close-explanation-$[id]");
        
        if(btnCloseExplanation) {
          const btnOpenExplanation = document.getElementById("btn-open-explanation-question-$[id]");

          btnOpenExplanation.onclick = () => {
            document.getElementById("$[id]-question-explanation").classList.remove("invisible-element");
          }
          btnOpenExplanation.style.display = "flex";
          
          btnCloseExplanation.onclick = () => {
            document.getElementById("$[id]-question-explanation").classList.add("invisible-element");
          }
        }

        $[onSubmitCode]
      }

      const registerQuestion$[id] = () => {
        const interactiveQuestionElement = document.getElementById("interactive-lesson");

        interactiveQuestionElement.setAttribute("question-register", "$[id]")
      }

      setTimeout(registerQuestion$[id], 500);

      const registerQuestion$[id]ExplanationEvent = () => {
        const btnCloseExplanation = document.getElementById("btn-close-explanation-$[id]");

        if(btnCloseExplanation) {
          const btnOpenExplanation = document.getElementById("btn-open-explanation-question-$[id]");
          if(btnOpenExplanation) {
            btnOpenExplanation.onclick = () => {
              document.getElementById("$[id]-question-explanation").classList.remove("invisible-element");
            }
  
            btnCloseExplanation.onclick = () => {
              document.getElementById("$[id]-question-explanation").classList.add("invisible-element");
            }
          }
        }
      };

      registerQuestion$[id]ExplanationEvent();
    `,
};
