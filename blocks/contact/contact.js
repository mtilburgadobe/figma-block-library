function createField(labelText, type, name, placeholder) {
  const wrapper = document.createElement('div');
  wrapper.className = 'contact-field';

  const label = document.createElement('label');
  label.className = 'contact-label';
  label.textContent = labelText;
  label.htmlFor = `contact-${name}`;
  wrapper.append(label);

  if (type === 'textarea') {
    const textarea = document.createElement('textarea');
    textarea.className = 'contact-input';
    textarea.id = `contact-${name}`;
    textarea.name = name;
    textarea.placeholder = placeholder;
    textarea.rows = 6;
    wrapper.append(textarea);
  } else {
    const input = document.createElement('input');
    input.className = 'contact-input';
    input.type = type;
    input.id = `contact-${name}`;
    input.name = name;
    input.placeholder = placeholder;
    if (labelText.includes('*')) input.required = true;
    wrapper.append(input);
  }

  return wrapper;
}

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'contact-container';

  // form side
  const formEl = document.createElement('form');
  formEl.className = 'contact-form';

  // radio buttons
  const radios = document.createElement('div');
  radios.className = 'contact-radios';

  const options = ['Say Hi', 'Get a Quote'];
  options.forEach((label, i) => {
    const radioLabel = document.createElement('label');
    radioLabel.className = 'contact-radio';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'contact-type';
    input.value = label.toLowerCase().replace(/\s+/g, '-');
    if (i === 0) input.checked = true;
    radioLabel.append(input);
    const span = document.createElement('span');
    span.textContent = label;
    radioLabel.append(span);
    radios.append(radioLabel);
  });
  formEl.append(radios);

  // fields
  const fields = document.createElement('div');
  fields.className = 'contact-fields';

  const nameField = createField('Name', 'text', 'name', 'Name');
  const emailField = createField('Email*', 'email', 'email', 'Email');
  const messageField = createField('Message*', 'textarea', 'message', 'Message');

  fields.append(nameField, emailField, messageField);
  formEl.append(fields);

  // submit button
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'contact-submit';
  submit.textContent = 'Send Message';
  formEl.append(submit);

  // illustration side - extract from block content if available
  const illustration = document.createElement('div');
  illustration.className = 'contact-illustration';

  const pic = block.querySelector('picture');
  if (pic) {
    illustration.append(pic);
  }

  container.append(formEl, illustration);
  block.replaceChildren(container);
}
