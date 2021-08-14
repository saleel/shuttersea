import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/header';
import PhotoViewer from '../../components/photo-viewer';

export default function Home() {
  const [photo, setPhoto] = React.useState();

  const router = useRouter();
  const { photoId } = router.query;

  React.useEffect(() => {
    (async function loadPhoto() {
      const res = await axios.get(`/api/photos?id=${photoId}`);
      setPhoto(res.data[0]);
    }());
  }, [photoId]);

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '-2rem' }}>
        {photo ? (
          <PhotoViewer photo={photo} />
        ) : (
          <div className="container">
            <span className="icon is-large">
              <i className="fas fa-spinner fa-spin" />
            </span>
          </div>
        )}
      </div>
    </>
  );
}
