import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';

import classes from './MultiStepFormControls.module.css';
import { useNavigate } from 'react-router';

export default function MultiStepFormControls({
  currentStep = 0,
  steps = [],
  onPrevious,
  onNext,
  isFormValid = false,
  lastButtonName = 'Finish',
  isCancelButton = false,
  cancelRedirect = undefined,
}) {
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);
  const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [isCreateButtonVisible, setIsCreateButtonVisible] = useState(false);

  useEffect(() => {
    const lastStepIndex = steps.length - 1;
    const nextToLastStepIndex = steps.length - 2;

    setIsBackButtonDisabled(currentStep === 0);
    setIsBackButtonVisible(currentStep < lastStepIndex);
    setIsNextButtonVisible(currentStep < nextToLastStepIndex);
    setIsCreateButtonVisible(currentStep === nextToLastStepIndex);
  }, [currentStep, steps.length]);

  let navigate = useNavigate();

  return (
    <div className={classes.controls}>
      {isBackButtonVisible && !isCancelButton && (
        <Button
          isAlt={true}
          disabled={isBackButtonDisabled}
          onClick={onPrevious}
        >
          Back
        </Button>
      )}

      {isCancelButton && cancelRedirect && (
        <Button isAlt={true} onClick={() => navigate(cancelRedirect)}>
          Cancel
        </Button>
      )}

      {isNextButtonVisible && (
        <Button disabled={!isFormValid} onClick={onNext}>
          Next
        </Button>
      )}

      {isCreateButtonVisible && (
        <Button type="submit" disabled={!isFormValid}>
          {lastButtonName}
        </Button>
      )}
    </div>
  );
}
