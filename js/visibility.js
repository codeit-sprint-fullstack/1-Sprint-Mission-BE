function togglePasswordVisibility(fieldId, toggleElement) {
    const field = document.getElementById(fieldId);
    const isPasswordVisible = field.type === 'text';
    field.type = isPasswordVisible ? 'password' : 'text';
    toggleElement.querySelector('img').src = isPasswordVisible ? '/image/invisible.svg' : '/image/visible.svg';
}
