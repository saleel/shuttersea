import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import PhotoGrid from '../components/photo-grid';
import Header from '../components/header';

export default function Home() {
  const [photos, setPhotos] = React.useState([]);

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
          <p className="description">
            ShutterSea is a decentralized platform for freely usable images.
            <br />
            <p className="description-subtitle">
              <Link href="/license">See License</Link>
              {/* You use the images for free even for commercial use. Attribution is not required, but recommended. */}
            </p>

          </p>

          <PhotoGrid photos={photos} />

        </main>

      </div>
    </>
  );
}
