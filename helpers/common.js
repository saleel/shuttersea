// eslint-disable-next-line import/prefer-default-export
export function getFileNameForSize(fileName, size) {
  const extension = fileName.split('.').pop();
  let fileNameForSize = fileName.split('.').slice(0, -1);
  fileNameForSize.push('_', size, '.', extension);
  fileNameForSize = fileNameForSize.join('');

  return fileNameForSize;
}

export function getPhotoUrl(photo, size = 'small') {
  const hasRequiredSize = (photo.availableSizes || []).includes(size);
  if (hasRequiredSize) {
    return `https://${photo.cid}.ipfs.dweb.link/${getFileNameForSize(photo.fileName, 'small')}`;
  }

  return `https://${photo.cid}.ipfs.dweb.link/${getFileNameForSize(photo.fileName, 'original')}`;
}
