import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Header from '../components/header';
import { authenticate, signData } from '../helpers/ceramic';

export default function Upload() {
  const [selectedPhoto, setSelectedPhoto] = React.useState();
  const [isSubmitting, setIsSubmitting] = React.useState();

  const router = useRouter();

  React.useEffect(() => {
    (async function ensureAuth() {
      if (!window.userId) {
        try {
          await authenticate();
        } catch (error) {
          router.push('/profile');
        }
      }
    }());

    // eslint-disable-next-line global-require
    require('@creativebulma/bulma-tagsinput').default.attach();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!window.ceramic || !window.ceramic.did) {
        await authenticate();
      }

      const formData = new FormData(e.target);

      formData.set('userId', window.userId);

      const dataToSign = `${formData.get('title')}${selectedPhoto.name}`.replaceAll(' ', '').replaceAll('.', '');
      const signature = await signData(dataToSign);

      formData.set('signature', signature);

      const response = await axios.post('/api/photos', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      setIsSubmitting(false);

      // eslint-disable-next-line no-undef
      router.push(`photo/${response.data[0]}`);
    } catch (error) {
      window.alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <div className="container">

        <div className="is-flex is-flex-direction-column mt-6">

          <h2 className="title is-4 mb-2">Submit new image to ShutterSea</h2>
          <Link passHref href="/license"><span className="mb-6 link">View License</span></Link>

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
                  <input
                    id="tags"
                    className="input"
                    name="tags"
                    type="text"
                    data-type="tags"
                    placeholder="Add tags"
                    dataType="tags"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-tags" />
                  </span>
                </div>
              </div>

              <input type="submit" disabled={isSubmitting} className={`button is-link mt-4${isSubmitting ? ' is-loading' : ''}`} />
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
