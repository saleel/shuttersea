import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Search from './search';

export default function Header(props) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ShutterSea - Royalty free images and stock photos</title>
        <meta name="description" content="Decentralized platform for freely usable, attribution-free, royalty-free images and stock photos" />
      </Head>

      <header className="header">
        <h1 className="logo"><Link href="/">ShutterSea</Link></h1>

        {router.pathname !== '/' && (
          <Search keyword={props.keyword} />
        )}

        <Link href="/upload">
          <div className="button is-light">Submit Photo</div>
        </Link>
      </header>
    </>
  );
}
