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


interface coinInterface {
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

async function getCoin (): Promise<coinInterface[]>
async function getCoin (name: string): Promise<coinInterface>

async function getCoin  (name?: string): Promise<coinInterface | coinInterface[] | undefined> {
    const res = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
        method: "GET",
        headers: {
            'X-CMC_PRO_API_KEY': process.env['apikey'] || '',
        }
    })

    if (!res.ok) {
        throw new Error(`Request error ${res.status}`)
    }

    const data = await res.json()
    const coins: coinInterface[] = data.data

    if (name) {
        const coin: coinInterface | undefined = coins.find( e => {
                if (e.name === name) {
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