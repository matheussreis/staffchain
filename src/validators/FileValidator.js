import GeneralValidator from './GeneralValidator';

export default class FileValidator extends GeneralValidator {
  #allowedFileExtensions = [
    'pdf',
    'docx',
    'odt',
    'jpg',
    'png',
    'jpeg',
    'pages',
  ];

  #allowedFileSizeBytes = 5e7;

  #isFileExtensionInvalid(fileExtension) {
    const matchingExtension = this.#allowedFileExtensions.filter(
      (extension) => extension === fileExtension
    );

    return matchingExtension.length < 1;
  }

  validate(fileObject, fieldName = 'File', isRequired = true) {
    if (typeof fileObject !== 'object') {
      if (isRequired) {
        this.isValid = false;
        this.errorMessage = `${fieldName} cannot be empty`;
      }

      return;
    }

    if ('name' in fileObject) {
      const fileName = fileObject.name;
      const lastDotInFileIndex = fileName.lastIndexOf('.');

      if (lastDotInFileIndex < 1) {
        this.errorMessage = 'Invalid file';
        this.isValid = false;
        return;
      }

      const fileExtension = fileName.substring(lastDotInFileIndex + 1);
      if (this.#isFileExtensionInvalid(fileExtension)) {
        this.errorMessage = 'Invalid file extension';
        this.isValid = false;
        return;
      }
    }

    if ('size' in fileObject) {
      const fileSize = fileObject.size;

      if (fileSize > this.#allowedFileSizeBytes) {
        this.isValid = false;
        this.errorMessage = 'File size must be equal or less than 50MB';
      }
    }
  }
}
