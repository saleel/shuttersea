import Head from 'next/head'
import styles from './header.module.css'

export default function Header() {
  return (
    <>
      <Head>
        <title>Momento - Royalty free images and pictures</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <a href="/">Momento</a>
      </header>
    </>
  )
}
