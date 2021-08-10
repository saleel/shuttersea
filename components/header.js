import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header(props) {
  const [keyword, setKeyword] = React.useState(props.keyword);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ShutterSea - Royalty free images and stock photos</title>
        <meta name="description" content="Decentralized platform for freely usable, attribution-free, royalty-free images and stock photos" />
      </Head>

      <header className="header">
        <h1 className="logo"><Link href="/">ShutterSea</Link></h1>

        <form className="search" onSubmit={() => { router.push(`/search/${keyword}`); }}>
          <div className="control has-icons-left has-icons-right">
            <input
              className="input"
              type="text"
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-search" />
            </span>
          </div>
        </form>

        <Link href="/upload">
          <div className="button is-light">Submit Photo</div>
        </Link>
      </header>
    </>
  );
}
