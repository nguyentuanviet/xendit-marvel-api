import Character from "./character"
import CharacterRepo from "./repo/character/characterRepo"

class CharacterService {
    private characterRepo: CharacterRepo
    constructor(characterRepo: CharacterRepo) {
        this.characterRepo = characterRepo
    }
    async getAllCharacters() {
        let characters: Character[] = await this.characterRepo.getAll()
        let characterIds = characters.map(character => character.id)
        return characterIds
    }
    async getCharacterById(id: number) {
        const character = await this.characterRepo.getById(id)
        return {
            id: character.id,
            name: character.name,
            description: character.description
        }
    }
    async count() {
        return await this.characterRepo.count()
    }
}

export default CharacterService
