import dotenv from 'dotenv'
dotenv.config();

const config = {
    server: {
        HOSTNAME: "localhost",
        PORT: 8080
    },
    marvel: {
        PUBLIC_KEY: process.env.MARVEL_PUBLIC_KEY,
        PRIVATE_KEY: process.env.MARVEL_PRIVATE_KEY,
        API_URL: "http://gateway.marvel.com/v1/public"
    }
}

export default config