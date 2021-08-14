import React from 'react';
import Header from '../components/header';

export default function Upload() {
  return (
    <>
      <Header />
      <div className="container">

        <div className="is-flex is-flex-direction-column mt-6">

          <h2 className="title is-2">License</h2>

          <div className="content">
            <h2 className="subtitle is-4">Allowed</h2>
            <ul>
              <li>Free to use in any format.</li>
              <li>Free for commercial use.</li>
              <li>Attribution is not required. But highly encourages to credit the authors.</li>
              <li>Free to modify and use. Mention modified version in attribution (if providing).</li>
            </ul>

            <h2 className="subtitle is-4">Not allowed</h2>
            <ul>
              <li>Sell photos for money.</li>
              <li>Give away photos for any kind of incentives.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
