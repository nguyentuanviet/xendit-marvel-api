import Character from "../../character";

interface CharacterRepo {
    getAll: () => Promise<Character[]>
    getById: (id: number) => Promise<Character>
    count: () => Promise<number>
}

export default CharacterRepo