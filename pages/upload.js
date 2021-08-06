import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import React from 'react';
import EXIF from 'exif-js';
import Header from '../components/header';
import styles from '../styles/Home.module.css';

export default function Upload() {
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  async function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    const file = data.get('photo');
    const imageBase64 = await toBase64(file);

    await axios.post('/api/photos', {
      imageBase64,
      fileName: file.name,
      extension: file.type,
      title: data.get('title'),
      location: data.get('location'),
      tags: data.get('tags').split(','),
      authorId: 'saleel',
    });

    window.alert('Photo uploaded');
  }

  const [selectedPhoto, setSelectedPhoto] = React.useState();

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Upload a photo to Momento</h2>

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
                    setSelectedPhoto(e.target.value.split('\\').pop());
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
            <h2 className="subtitle">{selectedPhoto}</h2>

            <div className="field">
              <label htmlFor="title" className="label">Name</label>
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

            <input type="submit" />
          </div>

        </form>

      </div>
    </>
  );
}
