import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TwitterIcon,
  FacebookIcon,
  WhatsappIcon,
} from 'react-share';
import { authenticate, getProfileById, signData } from '../helpers/ceramic';
import { getPhotoUrl } from '../helpers/common';

function getDownloadUrl(photo, size) {
  // eslint-disable-next-line no-underscore-dangle
  return `/api/download?photoId=${photo._id}&size=${size}`;
}

export default function PhotoViewer(props) {
  const { photo } = props;

  const router = useRouter();

  const [profile, setProfile] = React.useState('');
  const [views, setViews] = React.useState('-');
  const [downloads, setDownloads] = React.useState('-');
  const [likes, setLikes] = React.useState('-');
  const [userLiked, setUserLiked] = React.useState();
  const [isDeleting, setIsDeleting] = React.useState();

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
    if (!photo?._id) {
      return;
    }

    getProfileById(photo.userId).then((p) => {
      if (p) {
        setProfile(p);
      }
    });

    // A small hack to prevent lot of views firing
    window.viewedPhotos = window.viewedPhotos || [];
    console.log(window.viewedPhotos)
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
      // setIsLiking(true);
      setLikes((c) => {
        if (userLiked) {
          return c - 1;
        }
        return c + 1;
      });
      setUserLiked((l) => !l);

      if (!window.userId) {
        try {
          await authenticate();
        } catch (error) {
          router.push('/profile');
        }
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
    }
  }

  async function onDeleteClick() {
    try {
      if (window.confirm('Are you sure you want to delete this photo?')) {
        setIsDeleting(true);
        const signature = await signData({ action: 'delete', photoId: photo.id });
        await axios.delete('/api/photos', { params: { id: photo._id, signature } });
        router.push('/');
        window.location.reload();
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  const photoUrl = `${window.location.origin}/photo/${photo?._id}`;

  return (
    <div className="photo-container">

      <header className="photo-modal-header">

        <div>
          {photo.info?.image && (
            <div className="dropdown is-hoverable mr-5">
              <div className="dropdown-trigger">
                <button type="button" className="button" aria-haspopup="true" aria-controls="info-dropdown">
                  <span>Info</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true" />
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="info-dropdown" role="menu" style={{ minWidth: '27rem' }}>
                <div className="dropdown-content">
                  <div className="dropdown-item">
                    <div className="">
                      {Object.keys(photo.info.image).map((key) => (
                        <p key={key}>
                          <span className="has-text-weight-semibold">
                            {key}
                          </span>
                          <span>
                            {': '}
                            {photo.info.image[key]}
                          </span>
                        </p>
                      ))}
                      {Object.keys(photo.info.exif || {}).map((key) => (
                        <p key={key}>
                          <span className="has-text-weight-semibold">
                            {key}
                          </span>
                          <span>
                            {' : '}
                            {photo.info.exif[key]}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <FacebookShareButton className="p-1" url={photoUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton className="p-1" url={photoUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <WhatsappShareButton className="p-1" url={photoUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

        </div>

        <div>

          {window.userId && window.userId === photo.userId && (
            <button
              disabled={isDeleting}
              type="button"
              className="button is-secondary mr-3"
              onClick={onDeleteClick}
            >
              <span className="icon is-small">
                <i className="fas fa-trash" aria-hidden="true" />
              </span>
            </button>
          )}

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
          <div className="is-flex is-align-items-flex-end mb-3">
            <p className="title is-4 mb-0 mr-4">{photo.title}</p>

            {profile && (
              <div className="">
                <span className="icon">
                  <i className="fas fa-user" />
                </span>
                <Link passHref href={`/users/${photo.userId}`}>
                  <span className="photo-author is-size-6 mr-3">{profile?.name}</span>
                </Link>
              </div>
            )}
          </div>
          <div style={{ marginLeft: '-5px' }}>
            <span className="icon">
              <i className="fas fa-map-marker" />
            </span>
            <span className="is-size-6 mr-3">{photo.location}</span>

            <span className="icon">
              <i className="fas fa-calendar" />
            </span>
            <span className="is-size-6 mr-3">{new Date(photo.createdAt).toDateString()}</span>

            <span className="icon">
              <i className="fas fa-tags mr-1" />
            </span>
            <span className="is-size-6">{photo.tags.join(', ')}</span>
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
            // disabled={isLiking}
          >
            <p>
              {/* {isLiking ? (
                <span className="icon is-small">
                  <i className="fas fa-spinner fa-spin" />
                </span>
              ) : ( */}
              <span className="icon is-small">
                <i className="fas fa-heart" />
              </span>
              {/* )} */}
            </p>
            <p className="is-size-7">{likes}</p>
          </button>

        </div>

      </footer>

    </div>
  );
}
