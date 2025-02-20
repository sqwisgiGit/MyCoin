import redis from "@/app/lib/redis";

interface quoteTemplate {
    price: number;
    volume_24h: number;
    volume_change_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    market_cap: number;
    market_cap_dominance: number;
    fully_diluted_market_cap: number;
    last_updated: string;
}


interface quoteInterface {
    [currency: string]: quoteTemplate;
}


export interface coinInterface {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    cmc_rank: number;
    num_market_pairs: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    infinite_supply: boolean;
    last_updated: string;
    date_added: string;
    tags: string[];
    platform: null;
    self_reported_circulating_supply: null;
    self_reported_market_cap: null;
    quote: quoteInterface;
}

const COIN_CACHE_KEY = 'cached-coins'

let coinC: null | Promise<coinInterface[]> = null

async function cachedCoins() {
    console.log('Coins are cached')
    const req = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
        method: "GET",
        headers: {
            'X-CMC_PRO_API_KEY': process.env['apikey'] || '',
        }
    })
    if ( !req.ok ) {
        throw new Error(`Request error ${req.status}`)
    }
    const res = await req.json()
        .catch( e => {throw new Error(`Error with parsing JSON file: ${e}`)} )
    if ( !res ) {
        throw new Error(`Request is empty`)
    }
    coinC = res.data
    redis.set(COIN_CACHE_KEY, JSON.stringify(coinC))
    setTimeout(cachedCoins, 60 * 1000)
}

cachedCoins()
    .catch( e => console.log(e))

async function getCoin (): Promise<coinInterface[]>
async function getCoin (symbol: string): Promise<coinInterface>

async function getCoin (symbol?: string): Promise<coinInterface | coinInterface[] | undefined> {

    const coinsJSON = await redis.get(COIN_CACHE_KEY)
        .catch( e => {throw new Error(`Error with parsing redis JSON file: ${e}`)} )
    if ( !coinsJSON ) {
        throw new Error(`JSON is null`)
    }
    const coins: coinInterface[] = JSON.parse(coinsJSON)

    if (symbol) {
        const coin: coinInterface | undefined = coins.find( e => {
                if (e.symbol === symbol) {
                    return e
                }
            }
        )
        return coin
    } else {
        return coins
    }
}

export default getCoin