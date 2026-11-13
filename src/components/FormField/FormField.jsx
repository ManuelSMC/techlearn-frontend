/** Campo de formulario con etiqueta, mensaje de ayuda y error de validación. */
export default function FormField({ id, label, error, hint, as = 'input', ...inputProps }) {
  const Input = as;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="form__field">
      <label className="form__label" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        name={id}
        className={`form__input ${error ? 'form__input--invalid' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="form__error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="form__hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
