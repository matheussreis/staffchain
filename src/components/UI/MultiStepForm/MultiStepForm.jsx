import React from 'react';
import Form from '../Form/Form';
import FormTitle from '../Form/FormTitle';
import Container from '../Container/Container';
import MultiStepFormControls from './MultiStepFormControls';

import classes from './MultiStepForm.module.css';

export default function MultiStepForm({
  onSubmit,
  currentStep = 0,
  steps = [],
  goToPreviousStep,
  goToNextStep,
  isFormValid = false,
  lastButtonName,
  formTitle,
  isCancelButton = false,
  cancelRedirect = undefined,
}) {
  const CurentStep = steps[currentStep];

  return (
    <Container className={classes['form-container']}>
      <Form className={classes.form} onSubmit={onSubmit}>
        <FormTitle text={formTitle} />
        <CurentStep />
        <MultiStepFormControls
          currentStep={currentStep}
          steps={steps}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          lastButtonName={lastButtonName || 'Finish'}
          isFormValid={isFormValid}
          isCancelButton={isCancelButton}
          cancelRedirect={cancelRedirect}
        />
      </Form>
    </Container>
  );
}
