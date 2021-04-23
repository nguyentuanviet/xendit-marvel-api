import Character from "../../character";
import CharacterRepo from "./characterRepo";
import InMemoryDataStore from "./inMemoryDataStore";
import NetworkDataStore from "./networkDataStore";

class GenericCharacterRepo implements CharacterRepo {
    private inMemoryDataStore: InMemoryDataStore
    private networkDataStore: NetworkDataStore
    private isFetchedAllOnce = false

    constructor(inMemoryDataStore: InMemoryDataStore, networkDataStore: NetworkDataStore) {
        this.inMemoryDataStore = inMemoryDataStore
        this.networkDataStore = networkDataStore
    }
    async getAll(): Promise<Character[]> {
        let characters = this.inMemoryDataStore.getAll()
        if (!this.isFetchedAllOnce) {
            return await this.refreshCache()
        } else {
            this.checkIfCacheDirty()
            // go ahead and return existing records even though they might be dirty for now
            // we should aim for eventual consistency
            return characters
        }
    }
    async getById(id: number): Promise<Character> {
        let character = this.inMemoryDataStore.getById(id)
        if (character) {
            return character
        }

        character = await this.networkDataStore.getById(id)
        this.inMemoryDataStore.insert(character)
        return character
    }
    async count(): Promise<number> {
        return await this.networkDataStore.count()
    }

    async refreshCache(): Promise<Character[]> {
        const characters = await this.networkDataStore.getAll()
        characters.forEach(char => { this.inMemoryDataStore.insert(char) })
        this.isFetchedAllOnce = true
        return characters
    }

    async checkIfCacheDirty() {
        const currentCharCount = this.inMemoryDataStore.count()
        const latestCharCount = await this.networkDataStore.count()
        const isDirty = currentCharCount !== latestCharCount
        if (isDirty) {
            this.refreshCache()
        }
    }
}

export default GenericCharacterRepo