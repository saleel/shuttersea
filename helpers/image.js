import sharp from 'sharp';
import EXIF from 'exif';
import sizeOf from 'image-size';

export async function resizeImage(buffer) {
  const dimensions = sizeOf(buffer);
  const originalWidth = dimensions.width;

  const allWidths = {
    original: buffer,
  };

  if (originalWidth > 1000) {
    allWidths.small = await sharp(buffer).resize({ width: 1000 }).toBuffer();
  }

  if (originalWidth > 2000) {
    allWidths.medium = await sharp(buffer).resize({ width: 2000 }).toBuffer();
  }

  if (originalWidth > 3000) {
    allWidths.large = await sharp(buffer).resize({ width: 3000 }).toBuffer();
  }

  return allWidths;
}

export function parseImageInfo(buffer) {
  return new Promise((resolve) => {
    try {
      // eslint-disable-next-line no-new
      new EXIF.ExifImage(buffer, ((error, exifData) => {
        if (error || !exifData) {
          resolve({});
          return;
        }

        const { image = {}, exif = {}, gps = {} } = exifData;
        const {
          Make, Model, Software, ModifyDate,
        } = image;
        const {
          ExposureTime, FNumber, ISO, DateTimeOriginal, CreateDate, ShutterSpeedValue, ApertureValue,
          BrightnessValue, Flash, FocalLength, SubjectArea, LensInfo, LensMake, LensModel, ExifImageWidth, ExifImageHeight,
        } = exif;

        const info = {
          image: {
            Make, Model, Software, ModifyDate,
          },
          exif: {
            ExposureTime,
            FNumber,
            ISO,
            DateTimeOriginal,
            CreateDate,
            ShutterSpeedValue,
            ApertureValue,
            BrightnessValue,
            Flash,
            FocalLength,
            SubjectArea,
            LensInfo,
            LensMake,
            LensModel,
            ExifImageWidth,
            ExifImageHeight,
          },
          gps,
        };

        resolve(info);
      }));
    } catch (error) {
      resolve({});
    }
  });
}
