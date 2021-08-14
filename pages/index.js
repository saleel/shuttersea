import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import PhotoGrid from '../components/photo-grid';
import Header from '../components/header';
import Search from '../components/search';

export default function Home() {
  const [photos, setPhotos] = React.useState();

  React.useEffect(() => {
    (async function loadDefaults() {
      const res = await axios.get('/api/photos');
      setPhotos(res.data);
    }());
  }, []);

  return (
    <>
      <Header />
      <div className="container">

        <main className="main">

          <h1 className="title">ShutterSea</h1>
          <p className="description">
            A decentralized platform for freely usable images.
          </p>

          <div className="is-flex is-align-items-center w-100 is-flex-direction-column mt-5">
            <Search large />

            <div className="mt-6 mb-3">
              <span className="mx-1"><Link href="/why-share">Why Share</Link></span>
              <span className="mx-1"><Link href="/license">View License</Link></span>
            </div>
          </div>

          <hr />
          <h3 className="title is-4 mb-5">Top Images</h3>

          <PhotoGrid photos={photos} />

        </main>

      </div>
    </>
  );
}
