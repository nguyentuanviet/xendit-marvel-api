# Marvel-API

The Marvel Comics API allows developers to access information on Marvel characters

## Pre-Installation

### NodeJS and Package Manager

API is build based on NodeJS - a JavaScript runtime built on Chrome's V8 JavaScript engine.
- Read more from [here](https://nodejs.org/en/about/)
- Download and install from [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Install Yarn as a Package Manager
```bash
npm install -g yarn
```

### Marvel-API

Update Marvel API private key and public key from [Marvel](https://developer.marvel.com/). You will need to signup for an account if you don't have once.

## Installation

1. Create environment file named `.env` 
2. In `.env` file, set `{MARVEL_PUBLIC_KEY}` and `{MARVEL_PRIVATE_KEY}`.

3. Install
```bash
yarn
```

4. Start
```bash
yarn start
```

5. Run test
```bash
yarn test
```

## Usage

### API Docs:
```http
/ GET / http://localhost:8080/api-reference
```

### Get Array of all characters

```http
/ GET / http://localhost:8080/characters
```

### Get single character

```http
/ GET / http://localhost:8080/characters/{character-id}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)