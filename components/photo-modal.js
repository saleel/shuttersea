import React from 'react';
import Link from 'next/link';
import { getProfileById } from '../helpers/ceramic';
import { getPhotoUrl } from '../helpers/common';

function getDownloadUrl(photo, size) {
  // eslint-disable-next-line no-underscore-dangle
  return `/api/download?photoId=${photo._id}&size=${size}`;
}

export default function PhotoGrid(props) {
  const { photo, onClose } = props;
  const [profile, setProfile] = React.useState('');

  React.useEffect(() => {
    getProfileById(photo.userId).then((p) => {
      if (p) {
        setProfile(p);
      }
    });
  }, [photo]);

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
                <p className="is-size-5">{photo.downloads}</p>
                <p className="is-size-7">Downloads</p>
              </div>

              <div className="photo-modal-info mr-2">
                <p className="is-size-5">{photo.downloads}</p>
                <p className="is-size-7">Views</p>
              </div>

              <button type="button" className="button photo-modal-info">
                <p>
                  <span className="icon is-small">
                    <i className="fas fa-heart" />
                  </span>
                </p>
                <p className="is-size-7">{photo.downloads}</p>
              </button>

            </div>

          </footer>

        </div>
      </div>

      <button type="button" className="modal-close is-large" aria-label="close" onClick={onClose} />
    </div>
  );
}
