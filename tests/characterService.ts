import assert from "assert"
import { expect } from 'chai'
import sinon from "sinon"

import CharacterService from '../src/characterService';
import GenericCharacterRepo from '../src/repo/character/genericCharacterRepo'
import InMemoryDataStore from "../src/repo/character/inMemoryDataStore";
import NetworkDataStore from "../src/repo/character/networkDataStore";

const fakeCharacter = {
  id: 123,
  name: 'Thanos',
  description: 'Savior of the world'
}
const fakeCharacters = [{
  id: 123,
  name: 'Thanos',
  description: 'Savior of the world'
}, {
  id: 456,
  name: 'Captain America',
  description: 'Nice guy'
}]

describe('CharacterService Class', function () {
  describe('getAllCharacters', () => {
    it('should get all characters successfully', async function () {
      const fakeInMemoryDataStore = new InMemoryDataStore()
      const fakeNetworkDataStore = new NetworkDataStore()

      const characterRepo = new GenericCharacterRepo(fakeInMemoryDataStore, fakeNetworkDataStore)
      const characterService = new CharacterService(characterRepo)

      sinon.stub(fakeNetworkDataStore, 'getAll').returns(Promise.resolve(fakeCharacters))
      const characters = await characterService.getAllCharacters()
      assert.strictEqual(2, characters.length)
    })
    it('should refresh cache if dirty -- more characters is available in marvel', async function() {
      const fakeInMemoryDataStore = new InMemoryDataStore()
      const fakeNetworkDataStore = new NetworkDataStore()

      const characterRepo = new GenericCharacterRepo(fakeInMemoryDataStore, fakeNetworkDataStore)
      const characterService = new CharacterService(characterRepo)
      sinon.stub(fakeNetworkDataStore, 'getAll').returns(Promise.resolve(fakeCharacters))
      await characterService.getAllCharacters()

      sinon.stub(fakeNetworkDataStore, 'count').returns(Promise.resolve(10))
      const mock = sinon.mock(characterRepo)
      mock.expects("refreshCache").once()
      await characterService.getAllCharacters()

      mock.verify()
    })
  })
  
  describe('getCharacterById', () => {
    it('should get character successfully', async function () {

      const fakeInMemoryDataStore = new InMemoryDataStore()
      const fakeNetworkDataStore = new NetworkDataStore()
      const characterRepo = new GenericCharacterRepo(fakeInMemoryDataStore, fakeNetworkDataStore)
      const characterService = new CharacterService(characterRepo)

      // cache miss first in in-memory data store
      assert.strictEqual(fakeInMemoryDataStore.count(), 0)
      assert.strictEqual(fakeInMemoryDataStore.getById(123), undefined)

      sinon.stub(fakeNetworkDataStore, 'getById').returns(Promise.resolve(fakeCharacter))
      const character = await characterService.getCharacterById(123)

      // cache hit 
      assert.strictEqual(fakeInMemoryDataStore.count(), 1)
      assert.strictEqual(fakeInMemoryDataStore.getById(123).id,  123)
      assert.strictEqual(character.id, 123)
    })
  })
})