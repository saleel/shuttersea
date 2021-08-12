import axios from 'axios';
import React from 'react';
import Header from '../components/header';

export default function Upload() {
  const [selectedPhoto, setSelectedPhoto] = React.useState();
  const [isSubmitting, setIsSubmitting] = React.useState();

  async function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    setIsSubmitting(true);
    try {
      await axios.post('/api/photos', data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      setIsSubmitting(false);

      // eslint-disable-next-line no-undef
      window.location.replace('/');
    } catch (err) {
      setIsSubmitting(false);
      window.alert(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <Header />
      <div className="container">

        <div className="is-flex is-flex-direction-column mt-6">

          <h2 className="title is-4 mb-6">Submit new image to ShutterSea</h2>

          <form onSubmit={onSubmit}>

            <div className="file" style={{ display: selectedPhoto ? 'none' : 'block' }}>
              <label className="file-label">
                <input
                  id="photo"
                  className="file-input"
                  type="file"
                  name="photo"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.value) {
                      setSelectedPhoto(e.target.files[0]);
                    }
                  }}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload" />
                  </span>
                  <span className="file-label">
                    Choose a photo...
                  </span>
                </span>
              </label>
            </div>

            <div style={{ display: selectedPhoto ? 'block' : 'none' }}>
              {/* <h2 className="subtitle">{selectedPhoto?.name}</h2> */}

              {selectedPhoto && (
                <img
                  src={URL.createObjectURL(selectedPhoto)}
                  alt={selectedPhoto.name}
                  width="400"
                  className="mb-5"
                />
              )}

              <div className="field">
                <label htmlFor="title" className="label">Title</label>
                <div className="control has-icons-left">
                  <input id="title" className="input" required name="title" type="text" placeholder="A title for this photo" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-image" />
                  </span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="location" className="label">Location</label>
                <div className="control has-icons-left">
                  <input id="location" className="input" name="location" required type="text" placeholder="Where was this photo taken?" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="tags" className="label">Tags</label>
                <div className="control has-icons-left">
                  <input id="tags" className="input" name="tags" type="text" data-type="tags" placeholder="Add tags" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-tags" />
                  </span>
                </div>
              </div>

              <input type="submit" className={`button is-link mt-4${isSubmitting ? ' is-loading' : ''}`} />
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
