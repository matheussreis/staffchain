import { useReducer } from 'react';
import { getValidatorByInputType } from '../utils/enum-utils';

const initialInputState = {
  value: '',
  isTouched: false,
  defaultValueSet: false,
};

function inputStateReducer(state, action) {
  if (action.type === 'INPUT') {
    return {
      value: action.value,
      isTouched: state.isTouched,
      defaultValueSet: state.defaultValueSet,
    };
  }

  if (action.type === 'INPUT_FILE') {
    return {
      value: action.value,
      isTouched: true,
      defaultValueSet: state.defaultValueSet,
    };
  }

  if (action.type === 'BLUR') {
    return {
      value: state.value,
      isTouched: true,
      defaultValueSet: state.defaultValueSet,
    };
  }

  if (action.type === 'RESET') {
    return {
      value: '',
      isTouched: false,
      defaultValueSet: false,
    };
  }

  if (action.type === 'DEFAULT_VALUE') {
    return {
      value: action.value,
      isTouched: true,
      defaultValueSet: true,
    };
  }

  return initialInputState;
}

export default function useInput(validator, defaultValue = undefined) {
  const [inputType, args = []] = validator;
  const [state, dispatch] = useReducer(inputStateReducer, initialInputState);

  const validatorObject = getValidatorByInputType(inputType);

  validatorObject.validate(state.value, ...args);
  const { isValid, errorMessage } = validatorObject;
  const hasError = !isValid && state.isTouched;

  if (defaultValue && !state.defaultValueSet) {
    dispatch({ type: 'DEFAULT_VALUE', value: defaultValue });
  }

  function valueChangeHandler(event) {
    dispatch({ type: 'INPUT', value: event.target.value });
  }

  function selectValueChangeHandler(value) {
    dispatch({ type: 'INPUT', value: value });
  }

  function fileChangeHandler(value) {
    dispatch({ type: 'INPUT_FILE', value: value });
  }

  function inputBlurHandler(event) {
    dispatch({ type: 'BLUR' });
  }

  function reset() {
    dispatch({ type: 'RESET' });
  }

  return {
    value: state.value,
    isValid: isValid,
    hasError,
    errorMessage,
    valueChangeHandler,
    selectValueChangeHandler,
    fileChangeHandler,
    inputBlurHandler,
    reset,
  };
}
