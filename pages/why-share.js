import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import Header from '../components/header';
import { authenticate, signData } from '../helpers/ceramic';

export default function Upload() {
  return (
    <>
      <Header />
      <div className="container">

        <div className="is-flex is-flex-direction-column mt-6">

          <h2 className="title is-2">Why Share Photos to ShutterSea</h2>

          <div className="content">
            <h2 className="subtitle is-4">As a photographer/creator:</h2>
            <ul>
              <li>Giving back to the community. Similar to open source software.</li>
              <li>Gain more exposure to your photos.</li>
              <li>Get more attention from attributions.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
