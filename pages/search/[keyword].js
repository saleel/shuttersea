import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import PhotoGrid from '../../components/photo-grid';
import Header from '../../components/header';

export default function Home() {
  const [photos, setPhotos] = React.useState([]);
  const router = useRouter();
  const { keyword } = router.query;

  React.useEffect(() => {
    (async function loadDefaults() {
      const res = await axios.get(`/api/photos?keyword=${keyword}`);
      setPhotos(res.data);
    }());
  }, [keyword]);

  return (
    <>
      <Header keyword={keyword} />
      <div className="container">

        <main className="main">
          <p className="is-size-4 mb-6">
            Search Results for
            {' '}
            <span className="has-text-weight-semibold is-size-3 ml-1">{keyword}</span>
          </p>

          <PhotoGrid photos={photos} />
        </main>

      </div>
    </>
  );
}
