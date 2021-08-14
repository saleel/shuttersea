import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Search from './search';

export default function Header(props) {
  const { keyword } = props;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ShutterSea - Royalty free images and stock photos</title>
        <meta name="description" content="Decentralized platform for freely usable, attribution-free, royalty-free images and stock photos" />
      </Head>

      <header className="header">
        <h1 className="logo">
          <Link href="/" passHref>
            <img alt="ShutterSea" src="/logo.png" />
          </Link>
        </h1>

        {router.pathname !== '/' && (
          <Search keyword={keyword} />
        )}

        <div>
          <Link href="/profile" passHref>
            <div className="button is-secondary mr-3">Profile</div>
          </Link>

          <Link href="/upload" passHref>
            <div className="button is-dark">Submit Photo</div>
          </Link>
        </div>
      </header>
    </>
  );
}
