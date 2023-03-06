import React from "react";
import { useParams } from "react-router-dom";

const SECTION_TITLES: { [key: string]: string } = {
  perfil: "Perfil",
  revisoes: "Revisões",
  desafios: "Desafios",
  jogos: "Jogos",
};

const SectionContentHolder: React.FC = () => {
  let { section } = useParams();

  if (section === undefined || !Object.keys(SECTION_TITLES).includes(section)) {
    return <>Wrong section</>;
  }

  return (
    <div id="section-content-holder">
      <div>
        <h1 className="section-title">{SECTION_TITLES[section]}</h1>
        <p className="secondary-body-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>

        <div className="subsection">
          <h3 className="subsection-title subheading">Base</h3>
          <div className="subsection-cards">
            <button className="card shadowed-element">
              <div
                className="image"
                style={{
                  backgroundImage: `url(https://img.freepik.com/free-vector/cute-astronaut-riding-rocket-waving-hand-cartoon-icon-illustration-science-technology-icon-concept_138676-2130.jpg?w=826&t=st=1678120387~exp=1678120987~hmac=de047fb93fce915d8127874309456a71f23c7a9e8ceae53bef2f204112835ccd)`,
                }}
              ></div>
              <div className="title">
                <span className="lesson-body">Conceito de equação</span>
              </div>
            </button>
            <button
              className="card shadowed-element secondary-color-gradient"
            >
              <div
                className="image"
                style={{
                  backgroundImage: `url(https://img.freepik.com/free-vector/cute-astronaut-riding-rocket-waving-hand-cartoon-icon-illustration-science-technology-icon-concept_138676-2130.jpg?w=826&t=st=1678120387~exp=1678120987~hmac=de047fb93fce915d8127874309456a71f23c7a9e8ceae53bef2f204112835ccd)`,
                }}
              ></div>
              <div className="title">
                <span className="lesson-body">Conceito de equação</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionContentHolder;
