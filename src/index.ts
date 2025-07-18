import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import axios, { AxiosResponse } from 'axios';

configDotenv();
const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, PORT, REDIRECT_URL } = process.env;


// Create express app
const app = express();
const port = PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Twitch Functions
export interface TwitchAuthorization {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string[];
    token_type: string;
}

export async function getUserLoginAccessToken(code: string): Promise<AxiosResponse<TwitchAuthorization>> {
    
    const authOptions = {
        url: 'https://id.twitch.tv/oauth2/token',
        form: {
          code: code,
          client_id: TWITCH_CLIENT_ID,
          client_secret: TWITCH_CLIENT_SECRET,
          redirect_uri: REDIRECT_URL,
          grant_type: 'authorization_code'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true
    };

    return axios.post(authOptions.url, authOptions.form, {
        headers: authOptions.headers
    })
    
}

// Token Table
const tokenTable: {
    [key: string]: TwitchAuthorization
} = {}
// Routes
app.get('/', (_, res) => {
  res.send('Twitch token receiver is running');
});

app.get('/callback', async (req, res) => {
    const { code, state } = req.query
    if (!code || typeof code !== 'string') {
        return res.status(400).send({
            error: 'Invalid code'
        })
    }
    if (!state || typeof state !== 'string') {
        return res.status(400).send({
            error: 'Invalid state'
        })
    }
    
    const response = await getUserLoginAccessToken(code)
    const auth = response.data

    tokenTable[state] = auth

    res.send({
        state,
        data: auth
    })
})

app.get('/token/:state', (req, res) => {
    const { state } = req.params
    const token = tokenTable[state]
    if (!token) {
        return res.status(404).send({ error: 'Token not found' })
    }
    res.send(token)
    delete tokenTable[state]
})
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
