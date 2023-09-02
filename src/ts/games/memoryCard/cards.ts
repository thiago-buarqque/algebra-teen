import { DataBase } from "../../firebase/database"

const descriptionCards = [
    {
        id: "description-1",
        value: "O dobro de um número.",
        isEquation: false,
        pair: "2",
    },
    {
        id: "description-2",
        value: "O antecessor de um número.",
        isEquation: false,
        pair: "1"
    },
    {
        id: "description-3",
        value: "A quinta parte de um número.",
        isEquation: false,
        pair: "2",
    },
    {
        id: "description-4",
        value: "O triplo da diferença entre um número e dez.",
        isEquation: false,
        pair: "1"
    },
    {
        id: "description-5",
        value: "A metade de um número somado com 15.",
        isEquation: false,
        pair: "2",
    },
    {
        id: "description-6",
        value: "O quadrado da soma de dois números.",
        isEquation: false,
        pair: "1"
    }
]

const equationCards = [
    {
        id: "equation-1",
        value: "2x",
        isEquation: true,
        pair: "description-1",
    },
    {
        id: "equation-2",
        value: "a-1",
        isEquation: true,
        pair: "description-2"
    },
    {
        id: "equation-3",
        value: "\\frac{1a}{5}",
        isEquation: true,
        pair: "description-3",
    },
    {
        id: "equation-4",
        value: "3(n-10)",
        isEquation: true,
        pair: "description-4"
    },
    {
        id: "equation-5",
        value: "\\frac{1b}{2}+15",
        isEquation: true,
        pair: "description-5",
    },
    {
        id: "equation-6",
        value: "(x+y)^2",
        isEquation: true,
        pair: "description-6"
    }
]

export const registerCards = () => {
    const database = new DataBase({path: "memoryCardAsset"})

    // database.addMultiple([...descriptionCards, ...equationCards]);
}