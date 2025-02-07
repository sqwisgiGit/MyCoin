import styles from "./page.module.css"
import LinkButton from "@/components/button/LinkButton";
import getCoin from "@/app/api/getCoin";

export default async function Home() {

    const coins = await getCoin()
    const bestCoins = [coins[0].name, coins[1].name, coins[2].name]


    return (
   <section className={styles.rootContainer}>
       <div className={styles.mainContainer}>
           <section className={styles.greetingsContainer}>
               <h1>
                   Welcome to MyCoins
               </h1>
               <h3>
                   Here, you can find your favourite cryptocurrency and more!
               </h3>
           </section>
           <section className={styles.mostPopularContainer}>
               <h1>
                   The most popular cryptocurrencies
               </h1>
               <section className={styles.popularCrypto}>
                   {bestCoins.map( (item) => {
                       return(
                           <LinkButton buttonType={'cryptoMenu'} link={`/cryptocurrency/${item}`} key={item} svg={true}>
                               {item}
                           </LinkButton>
                       )
                   } )}
               </section>
           </section>
       </div>
   </section>
    );
}
