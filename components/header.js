import Head from 'next/head';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <Head>
        <title>ShutterSea - Royalty free images and stock photos</title>
        <meta name="description" content="Decentralized platform for freely usable, attribution-free, royalty-free images and stock photos" />
      </Head>

      <header className="header">
        <h1 className="logo"><Link href="/">ShutterSea</Link></h1>

        <Link href="/upload">Submit Photo</Link>
      </header>
    </>
  );
}
