import express from 'express';
import config from './config/config';
import logging from './config/logging';
import CharacterService from './characterService';
import NetworkDataStore from './repo/character/networkDataStore';
import GenericCharacterRepo from './repo/character/genericCharacterRepo';
import InMemoryDataStore from './repo/character/inMemoryDataStore';

import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

const app = express();
const characterService = new CharacterService(new GenericCharacterRepo(new InMemoryDataStore(), new NetworkDataStore()))

//Swagger API Docs
const swaggerOptions = {
    customSiteTitle: "Marvel API",
}
app.use('/api-reference', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.get('/characters', (req, res) => {
    characterService.getAllCharacters().then(result => {
        res.json({
            metadata: {
                total: result.length
            },
            characters: result
        })
    }).catch(err => {
        console.error(err)
        res.status(500).json({
            error: err.message
        })
    })
})

app.get('/characters/:id', (req, res) => {
    characterService.getCharacterById(Number(req.params.id)).then(result => {
        res.json(result)
    }).catch(err => {
        console.error(err)
        res.status(500).json({
            error: err.message
        })
    })
})

app.listen(config.server.PORT,
    () => logging.info('SERVER', `Server is running ${config.server.HOSTNAME}:${config.server.PORT}`))
