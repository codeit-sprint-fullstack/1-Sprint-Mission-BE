function togglePasswordVisibility(fieldId, toggleElement) {
    const field = document.getElementById(fieldId);
    const isPasswordVisible = field.type === 'text';
    field.type = isPasswordVisible ? 'password' : 'text';
    toggleElement.querySelector('img').src = '/image/visibility.svg';
}