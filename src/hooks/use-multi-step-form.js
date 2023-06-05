import { useReducer } from 'react';

const initialState = {
  steps: [],
  currentStep: 0,
};

const multiStepFormReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT':
      return { steps: state.steps, currentStep: state.currentStep + 1 };
    case 'PREVIOUS':
      return { steps: state.steps, currentStep: state.currentStep - 1 };
    default:
      return initialState;
  }
};

export default function useMultiStepForm(steps) {
  if (steps) {
    initialState.steps = steps;
  }

  const [state, dispatch] = useReducer(multiStepFormReducer, initialState);

  const goToNextStep = () => {
    if (state.currentStep + 1 <= state.steps.length - 1) {
      dispatch({ type: 'NEXT' });
    }
  };

  const goToPreviousStep = () => {
    if (state.currentStep - 1 >= 0) {
      dispatch({ type: 'PREVIOUS' });
    }
  };

  return {
    steps: state.steps,
    currentStep: state.currentStep,
    goToPreviousStep,
    goToNextStep,
  };
}
