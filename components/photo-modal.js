import React from 'react';
import { getUserName } from '../helpers/ceramic';
import { getPhotoUrl } from '../helpers/common';

export default function PhotoGrid(props) {
  const { photo, onClose } = props;
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    getUserName(photo.userId).then((name) => {
      if (name) {
        setUserName(name);
      }
    });
  }, [photo]);

  return (
    <div className="modal is-active is-clipped">
      <div className="modal-background" />

      <div className="modal-contenst">
        <div className="photo-modal">

          <header className="photo-modal-header">

            <button type="button" className="button is-light is-normal mr-3">
              <span className="icon">
                <i className="fas fa-share" />
              </span>
              <span>
                Share
              </span>
            </button>
            <button type="button" className="button is-light is-normal">
              <span className="icon">
                <i className="fas fa-download" />
              </span>
              <span>
                Download
              </span>
            </button>

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

                <span className="icon">
                  <i className="fas fa-user" />
                </span>
                <span className="is-size-6 mr-3">{userName}</span>

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
