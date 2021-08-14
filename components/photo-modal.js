import React from 'react';
import PhotoViewer from './photo-viewer';

export default function PhotoGrid(props) {
  const { photo, onClose } = props;

  React.useEffect(() => {
    document.addEventListener('keydown', () => {
      const evt = window.event;
      let isEscape = false;
      if ('key' in evt) {
        isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
      } else {
        isEscape = (evt.keyCode === 27);
      }
      if (isEscape) {
        onClose();
      }
    });
  });

  return (
    <div className="modal is-active is-clipped">
      <div className="modal-background" />

      <div className="photo-modal">
        <PhotoViewer photo={photo} />
      </div>

      <button type="button" className="modal-close is-large" aria-label="close" onClick={onClose} />
    </div>
  );
}
