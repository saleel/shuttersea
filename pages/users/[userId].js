import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import PhotoGrid from '../../components/photo-grid';
import Header from '../../components/header';
import { getProfileById } from '../../helpers/ceramic';

export default function Home() {
  const [user, setUser] = React.useState();
  const [photos, setPhotos] = React.useState();

  const router = useRouter();
  const { userId } = router.query;

  React.useEffect(() => {
    (async function loadDefaults() {
      const profile = await getProfileById(userId);
      if (profile) {
        setUser(profile);
      }

      const res = await axios.get(`/api/photos?userId=${userId}`);
      setPhotos(res.data);
    }());
  }, [userId]);

  return (
    <>
      <Header />
      <div className="container">

        {user ? (
          <main className="main">
            <p className="is-size-4 mb-6">
              Photos By
              {' '}
              <span className="has-text-weight-semibold is-size-3 ml-1">{user.name}</span>
            </p>
            <PhotoGrid photos={photos} />
          </main>
        ) : (
          <main className="main">
            <p className="is-size-4 mb-6">
              <span className="icon is-small is-left mr-3">
                <i className="fas fa-spinner fa-spin" />
              </span>
              <span className="has-text-weight-semibold is-size-3 ml-1">Loading...</span>
            </p>
          </main>
        )}

      </div>
    </>
  );
}
