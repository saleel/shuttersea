import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Header from '../components/header';
import { authenticate, getProfile, updateProfile } from '../helpers/ceramic';

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true);
  // const [isAuthenticated, setIsAuthenticated] = React.useState(window.did && window.did.authenticated());
  const [profile, setProfile] = React.useState({});
  const [showForm, setShowForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    (async function loadDefaults() {
      await authenticate();
      setIsLoading(false);
      const didProfile = await getProfile();

      if (didProfile) {
        setProfile(didProfile);
        setShowForm(true);
      }
    }());
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    await updateProfile(profile);
    setIsSubmitting(false);
  }

  return (
    <>
      <Header />
      <div className="container">

        <main className="main">

          <h1 className="title">Profile</h1>

          {isLoading && (
          <p className="description">
            <span className="icon is-small is-left mr-3">
              <i className="fas fa-spinner fa-spin" />
            </span>
            Logging in using your wallet...
          </p>
          )}

          {showForm && (
            <form onSubmit={onSubmit}>
              <h3 className="subtitle">Manage your DID profile</h3>

              <div className="field">
                <label htmlFor="title" className="label">Name</label>
                <div className="control has-icons-left">
                  <input
                    id="title"
                    className="input"
                    value={profile.name}
                    onChange={(e) => { setProfile((p) => ({ ...p, name: e.target.value })); }}
                    required
                    name="title"
                    type="text"
                    placeholder="Display Name"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-image" />
                  </span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="location" className="label">Description</label>
                <div className="control has-icons-left">
                  <input id="location" className="input" name="location" required type="text" placeholder="A small bio about yourself" />
                  <span className="icon is-small is-left">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                </div>
              </div>

              <input type="submit" className={`button is-link mt-4${isSubmitting ? ' is-loading' : ''}`} />
            </form>
          )}

        </main>

      </div>
    </>
  );
}
