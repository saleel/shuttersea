import React from 'react';
import { getPhotoUrl } from '../helpers/common';
import PhotoModal from './photo-modal';

export default function PhotoGrid(props) {
  const { photos } = props;

  const [selectedPhoto, setSelectedPhoto] = React.useState();

  return (
    <>
      <div className="photo-grid">
        <div className="columns is-multiline">
          {photos.map((photo) => (
            <div key={photo.cid} className="column mb-3">

              <div
                className="photo-card"
                onClick={() => { setSelectedPhoto(photo); }}
                style={{ cursor: 'zoom-in' }}
                role="button"
                tabIndex="0"
              >

                <div className="photo-image">
                  <div className="photo-mask" />

                  <div
                    style={{
                      backgroundImage: `url(${getPhotoUrl(photo)})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                    alt={photo.title}
                  />
                </div>

                <div className="photo-meta">
                  <p className="photo-meta-title">{photo.title}</p>
                  <p className="photo-meta-location">{photo.location}</p>

                </div>
              </div>

            </div>
          ))}

          <div className="column" />

        </div>
      </div>

      {selectedPhoto && (
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => { setSelectedPhoto(); }}
      />
      )}

    </>
  );
}
