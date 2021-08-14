import React from 'react';
import ContentLoader from 'react-content-loader';
import { getPhotoUrl } from '../helpers/common';
import PhotoModal from './photo-modal';

export default function PhotoGrid(props) {
  const { photos } = props;

  const [selectedPhoto, setSelectedPhoto] = React.useState();

  if (!photos) {
    return (
      <div className="photo-grid">
        <div className="columns is-multiline">
          {[1, 2, 3].map((a) => (
            <div key={a} className="column mb-3">
              <ContentLoader
                speed={2}
                width={400}
                height={300}
                viewBox="0 0 400 300"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
              >
                <rect x="0" y="0" rx="3" ry="3" width="400" height="300" />
              </ContentLoader>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                      backgroundColor: '#efefef',
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

          {(photos.length % 3 !== 0) && (
            <div className="column" />
          )}

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
