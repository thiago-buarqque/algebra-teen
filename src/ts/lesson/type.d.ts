export type TStepElement = {
  step: TStep;
  stepNumber: number;
};

export type TCard = {
  title: string;
  description: string;
  background: string;
  image: string;
}

export type TSection = {
  page: string;
  title: string;
  index: number;
}

export type TLesson = {
  card: TCard;
  id: string;
  steps: TStep[];
  section: TSection;
  title: string;
  nextLesson: {
    id: string;
  }
}

export type TStep = {  
  content: TContent[];
  id: string;
  subvariation: "HORIZONTAL" | "VERTICAL";
  variation: "TWO_COLUMNS_SUBSTEPS" | "TWO_COLUMNS" | "SINGLE_COLUMN";
}

export type TContent = {
  actions: string;
  content: TContent[] | null;
  entityType: "CONTENT" | "SUBSTEP" | "SUBSTEPS_HOLDER";
  html: string;
  id: string;
  properties: string;
  script: string;
}
