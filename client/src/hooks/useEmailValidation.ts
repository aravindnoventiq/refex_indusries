export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface UseEmailValidationOptions {
  required?: boolean;
}

export function useEmailValidation(options: UseEmailValidationOptions = {}) {
  const { required = true } = options;

  const validateEmail = (value: string): string => {
    const trimmedValue = value.trim();

    if (required && !trimmedValue) {
      return 'Email is required';
    }

    if (trimmedValue && !EMAIL_REGEX.test(trimmedValue)) {
      return 'Enter a valid email address';
    }

    return '';
  };

  return { validateEmail };
}
