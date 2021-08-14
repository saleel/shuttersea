import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { authenticate, getProfileById, signData } from '../helpers/ceramic';
import { getPhotoUrl } from '../helpers/common';

function getDownloadUrl(photo, size) {
  // eslint-disable-next-line no-underscore-dangle
  return `/api/download?photoId=${photo._id}&size=${size}`;
}

// A small hack to prevent lot of views firing
window.viewedPhotos = window.viewedPhotos || [];

export default function PhotoGrid(props) {
  const { photo, onClose } = props;

  const [profile, setProfile] = React.useState('');
  const [views, setViews] = React.useState('-');
  const [downloads, setDownloads] = React.useState('-');
  const [likes, setLikes] = React.useState('-');
  const [userLiked, setUserLiked] = React.useState();
  const [isLiking, setIsLiking] = React.useState();

  function updateLikes() {
    axios.get('/api/actions', {
      params: {
        photoId: photo._id,
        action: 'like',
      },
    }).then(({ data }) => {
      setLikes(data.count);
    });

    if (window.userId) {
      axios.get('/api/actions', {
        params: {
          photoId: photo._id,
          action: 'like',
          userId: window.userId,
        },
      }).then(({ data }) => {
        if (data.count >= 1) {
          setUserLiked(true);
        }
      });
    }
  }

  React.useEffect(() => {
    getProfileById(photo.userId).then((p) => {
      if (p) {
        setProfile(p);
      }
    });

    if (!window.viewedPhotos.includes(photo._id)) {
      axios.post('/api/actions', {
        photoId: photo._id,
        action: 'view',
      });

      window.viewedPhotos.push(photo._id);
    }

    axios.get('/api/actions', {
      params: {
        photoId: photo._id,
        action: 'view',
      },
    }).then(({ data }) => {
      setViews(data.count);
    });

    axios.get('/api/actions', {
      params: {
        photoId: photo._id,
        action: 'download',
      },
    }).then(({ data }) => {
      setDownloads(data.count);
    });

    updateLikes();
  }, [photo]);

  async function onLikeClick() {
    try {
      setIsLiking(true);

      if (!window.userId) {
        await authenticate();
      }

      const data = {
        photoId: photo._id,
        action: userLiked ? 'unlike' : 'like',
        userId: window.userId,
      };

      const signature = await signData(data);

      data.signature = signature;

      await axios.post('/api/actions', data);

      updateLikes();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <div className="modal is-active is-clipped">
      <div className="modal-background" />

      <div className="modal-contenst">
        <div className="photo-modal">

          <header className="photo-modal-header">

            <button disabled type="button" className="button is-light is-normal mr-3">
              <span className="icon">
                <i className="fas fa-share" />
              </span>
              <span>
                Share
              </span>
            </button>

            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <button type="button" className="button is-light is-link" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>Download</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true" />
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  {(photo.availableSizes || ['original']).map((size) => (
                    <a
                      key={size}
                      target="_blank"
                      rel="nofollow noreferrer"
                      href={getDownloadUrl(photo, size)}
                      className="dropdown-item"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {size}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </header>

          <div className="photo-modal-image">
            <img
              src={`${getPhotoUrl(photo, 'original')}`}
              alt={photo.title}
            />
          </div>

          <footer className="photo-modal-footer">

            <div>
              <p className="title is-4 mb-2">{photo.title}</p>

              <div>
                <span className="icon">
                  <i className="fas fa-map-marker" />
                </span>
                <span className="is-size-6 mr-3">{photo.location}</span>

                {profile && (
                  <>
                    <span className="icon">
                      <i className="fas fa-user" />
                    </span>
                    <Link passHref href={`/users/${photo.userId}`}>
                      <span className="is-size-6 mr-3">{profile?.name}</span>
                    </Link>
                  </>
                )}

                <span className="icon">
                  <i className="fas fa-calendar" />
                </span>
                <span className="is-size-6">{new Date(photo.createdAt).toDateString()}</span>
              </div>

            </div>

            <div className="is-flex">
              <div className="photo-modal-info mr-2">
                <p className="is-size-5">{downloads}</p>
                <p className="is-size-7">Downloads</p>
              </div>

              <div className="photo-modal-info mr-2">
                <p className="is-size-5">{views}</p>
                <p className="is-size-7">Views</p>
              </div>

              <button
                type="button"
                className="button photo-modal-info"
                onClick={onLikeClick}
                disabled={isLiking}
              >
                <p>
                  {isLiking ? (
                    <span className="icon is-small">
                      <i className="fas fa-spinner fa-spin" />
                    </span>
                  ) : (
                    <span className="icon is-small">
                      <i className="fas fa-heart" />
                    </span>
                  )}
                </p>
                <p className="is-size-7">{likes}</p>
              </button>

            </div>

          </footer>

        </div>
      </div>

      <button type="button" className="modal-close is-large" aria-label="close" onClick={onClose} />
    </div>
  );
}
