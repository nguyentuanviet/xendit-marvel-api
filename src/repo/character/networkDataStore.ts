import Character from "../../character"
import config from "../../config/config"
import crypto from 'crypto'
import axios from "axios"
import DataStore from "./dataStore"

class NetworkDataStore implements DataStore {
    async getAll(): Promise<Character[]> {
        try {
            let characterCount: number = await this.count()
            let apiCallCount: number = characterCount / 100
            let promises = []
            let foundRecords: Character[] = []
            for (let i = 0; i < apiCallCount; i++) {
                promises.push(axios.get(`${config.marvel.API_URL}/characters`, {
                    params: this.buildApiCreds(i * 100)
                }))
            }
            console.info('freshly fetching all characters data')
            return await Promise.all(promises).then((responses) => {
                responses.forEach(response => {
                    foundRecords = foundRecords.concat(response.data.data.results)
                })
                return foundRecords
            })
        } catch (e) {
            throw e
        } 
    }
    async getById(id: number): Promise<Character> {
        let response = await axios.get(`${config.marvel.API_URL}/characters/${id}`, {
            params: this.buildApiCreds(0)
        })
        console.info(`[INFO] [${id}] retrieved from NetworkDataStore`)
        return response.data.data.results[0]
    }
    async count(): Promise<number> {
        try {
            let response = await axios.get(`${config.marvel.API_URL}/characters`, {
                params: this.buildApiCreds(0, 1)
            })
            const total: number = response.data.data.total
            return total
        } catch (err) {
            throw err
        }
    }

    private buildApiCreds(offset: number, limit: number = 100) {
        const timespan = Date.now()
        const data = timespan + config.marvel.PRIVATE_KEY + config.marvel.PUBLIC_KEY
        const params = {
            ts: timespan,
            apikey: config.marvel.PUBLIC_KEY,
            hash: crypto.createHash('md5').update(data).digest("hex"),
            limit: limit,
            offset: offset
        }
        return params
    }
}

export default NetworkDataStore