import Button from '../Button/Button';
import { useRef, useState } from 'react';
import { BiUpload } from 'react-icons/bi';
import BUTTON_SIZES from '../../../enums/button-sizes';
import useWindowDimensions from '../../../hooks/use-window-dimensions';

import classes from './FileUpload.module.css';

function UploadedFile({ fileName, onRemoveFile, hasError = false, width }) {
  const getCssClasses = (initialClass = '') => {
    let cssClasses = classes[initialClass];

    if (hasError) {
      cssClasses += ` ${classes.invalid}`;
    }

    return cssClasses;
  };

  const onClickHandler = () => {
    if (width < 769) {
      onRemoveFile();
    }
  };

  return (
    <div onClick={onClickHandler} className={getCssClasses('file-container')}>
      <p className={classes['file-name']}>{fileName}</p>
      <button
        type="button"
        onClick={() => onRemoveFile()}
        className={getCssClasses('remove-file-button')}
      >
        x
      </button>
    </div>
  );
}

export default function FileUpload({
  placeholder = null,
  hasError = false,
  errorMessage,
  onChange,
}) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(undefined);
  const windowDimensions = useWindowDimensions();

  const changeHandler = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const fileToSet = file;
    setFile(fileToSet);
    typeof onChange === 'function' && onChange(fileToSet);
  };

  const removeFileHandler = () => {
    setFile();
    fileInputRef.current.value = null;
    typeof onChange === 'function' && onChange();
  };

  return (
    <div className={classes.container}>
      {placeholder && (
        <label className={classes['field-name']}>{placeholder}:</label>
      )}
      <Button
        size={BUTTON_SIZES.LARGE}
        className={classes['upload-button']}
        onClick={() => {
          fileInputRef.current.click();
        }}
      >
        Upload File
        <BiUpload style={{ color: 'white' }} size="1.2rem" />
      </Button>
      {file && (
        <UploadedFile
          fileName={file.name}
          onRemoveFile={removeFileHandler}
          hasError={hasError}
          width={windowDimensions.width}
        />
      )}
      {hasError && <p className={classes.error}>{errorMessage}</p>}
      <input
        onChange={changeHandler}
        className={classes.input}
        type="file"
        name="fileupload"
        id="fileupload"
        ref={fileInputRef}
      />
    </div>
  );
}
