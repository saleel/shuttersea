import React from 'react';
import PhotoViewer from './photo-viewer';

export default function PhotoGrid(props) {
  const { photo, onClose } = props;

  return (
    <div className="modal is-active is-clipped">
      <div className="modal-background" />

      <div className="modal-content photo-container">
        <PhotoViewer photo={photo} />
      </div>

      <button type="button" className="modal-close is-large" aria-label="close" onClick={onClose} />
    </div>
  );
}
