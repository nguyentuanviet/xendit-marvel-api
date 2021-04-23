import Character from "../../character"
import DataStore from "./dataStore"

class InMemoryDataStore implements DataStore {
    private characterData: Map<number, Character> = new Map()
    updatedAt: number = Date.now()

    getAll(): Character[] {
        return Array.from(this.characterData.values())
    }
    getById(id: number): Character {
        const character = this.characterData.get(id)
        return character
    }
    insert(character: Character) {
        this.characterData.set(character.id, character)
        this.updatedAt = Date.now()
    }
    update(id: number) {
        this.characterData.delete(id)
        this.updatedAt = Date.now()
    }
    count() {
        return this.characterData.size
    }
}

export default InMemoryDataStore