import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import styles from "~/styles/Home.module.css";

function MyApp({ Component, pageProps }: AppProps) {
  return(
      <>
        <Component {...pageProps} />
        <footer className={styles.footer}>
          <div className={`${styles.float} ${styles.row}`}>
            <a
                href={"mailto:ride.poke@gmail.com"}
                target="_blank"
                rel="noopener noreferrer"
            >
              <img width="32px" src="/mail.svg" alt={"Icon of gmail"} />
            </a>
            <a
                href={"https://github.com/rhiroe"}
                target="_blank"
                rel="noopener noreferrer"
            >
              <img width="32px" src="/github.svg" alt={"Icon of twitter"} />
            </a>
            <a
                href={"https://twitter.com/messages/compose?recipient_id=509745934"}
                target="_blank"
                rel="noopener noreferrer"
            >
              <img width="32px" src="/twitter.svg" alt={"Icon of twitter"} />
            </a>
          </div>
          <div className={styles.row}>
            © 2022 rhiroe
          </div>
        </footer>
      </>
  )
}

export default MyApp
