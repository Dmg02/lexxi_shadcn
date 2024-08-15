import { useState, useCallback } from 'react';

interface FormField {
  value: any;
  error: string | null;
  validate?: (value: any) => string | null;
}

type FormState<T> = {
  [K in keyof T]: FormField;
};

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [formState, setFormState] = useState<FormState<T>>(() => 
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = { value: initialValues[key], error: null };
      return acc;
    }, {} as FormState<T>)
  );

  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], value, error: null }
    }));
  }, []);

  const setError = useCallback((field: keyof T, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      [field]: { ...prev[field], error }
    }));
  }, []);

  const validateField = useCallback((field: keyof T) => {
    const { value, validate } = formState[field];
    if (validate) {
      const error = validate(value);
      setError(field, error);
      return !error;
    }
    return true;
  }, [formState, setError]);

  const validateForm = useCallback(() => {
    let isValid = true;
    Object.keys(formState).forEach(key => {
      if (!validateField(key as keyof T)) {
        isValid = false;
      }
    });
    return isValid;
  }, [formState, validateField]);

  const getValues = useCallback(() => 
    Object.keys(formState).reduce((acc, key) => {
      acc[key as keyof T] = formState[key as keyof T].value;
      return acc;
    }, {} as T)
  , [formState]);

  return {
    values: getValues(),
    errors: Object.keys(formState).reduce((acc, key) => {
      acc[key as keyof T] = formState[key as keyof T].error;
      return acc;
    }, {} as Record<keyof T, string | null>),
    setValue,
    setError,
    validateField,
    validateForm,
  };
}

export default useForm;