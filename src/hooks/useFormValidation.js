import { useState, useCallback } from 'react';

// Validation rules
const validators = {
  username: (value) => {
    if (!value) return 'Username is required';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Only letters, numbers, and underscores allowed';
    }
    if (value.length < 4) return 'Username must be at least 4 characters';
    if (value.length > 20) return 'Username must be 20 characters or less';
    return '';
  },

  email: (value) => {
    if (!value) return 'Email is required';
    if (!value.includes('@')) return 'Email must contain @ symbol';
    const parts = value.split('@');
    if (parts.length !== 2) return 'Invalid email format';
    if (!parts[0]) return 'Email local part cannot be empty';
    if (!parts[1]) return 'Email domain cannot be empty';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-zA-Z]/.test(value)) return 'Password must contain letters';
    if (!/[0-9]/.test(value)) return 'Password must contain numbers';
    return '';
  },

  confirmPassword: (value, allValues) => {
    if (!value) return 'Please confirm your password';
    if (value !== allValues.password) return 'Passwords do not match';
    return '';
  },

  weight: (value) => {
    if (!value) return 'Weight is required';
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 20 || num > 500) return 'Weight must be between 20 and 500';
    return '';
  }
};

// Calculate password strength
const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Enter password', color: '#64748b' };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
    lengthExtra: password.length >= 12
  };

  if (checks.length) score += 25;
  if (checks.hasLetter) score += 25;
  if (checks.hasNumber) score += 25;
  if (checks.hasSpecial) score += 15;
  if (checks.lengthExtra) score += 10;

  let label = 'Weak';
  let color = '#ef4444';

  if (score >= 75) {
    label = 'Strong';
    color = '#10b981';
  } else if (score >= 50) {
    label = 'Medium';
    color = '#f59e0b';
  }

  return { score: Math.min(score, 100), label, color };
};

// Custom hook for form validation
export const useFormValidation = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name, value) => {
    const validator = validators[name];
    let error = '';
    if (validator) {
      // For confirmPassword, pass all values
      if (name === 'confirmPassword') {
        error = validator(value, values);
      } else {
        error = validator(value);
      }
    }
    return error;
  }, [values]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);

      // Validate all fields
      const newErrors = {};
      let isValid = true;

      Object.keys(values).forEach(field => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, values[field]);
        newErrors[field] = error;
        if (error) {
          isValid = false;
        }
      });

      setErrors(newErrors);

      if (isValid) {
        try {
          await onSubmit(e);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    };
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateField,
    passwordStrength: calculatePasswordStrength(values.password || '')
  };
};
