(() => {
  const current = new URL(location.href);
  const raw = document.body.dataset.funnel === 'delivery-demo' ? 'delivery-demo' : current.searchParams.get('src') || '';
  const source = /^(?:(?:vk|shorts|tg|dzen)-(?:0[1-9]|10)|(?:github|gallery|delivery)-demo)$/.test(raw) ? raw : 'direct';
  const count = (event) => {
    fetch('/_vf/funnel', {
      method: 'POST',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
      body: new URLSearchParams({ event, src: source }),
    }).catch(() => {});
  };

  if (document.body.dataset.funnel === 'delivery-demo') {
    const demo = document.getElementById('delivery-demo');
    function countOpen() {
      if (!demo.open) return;
      count('visits');
      demo.removeEventListener('toggle', countOpen);
    }
    demo.addEventListener('toggle', countOpen);
    return;
  }

  if (document.body.dataset.funnel === 'landing') {
    count('visits');
    if (source === 'direct') return;
    for (const link of document.querySelectorAll('a[href^="checkout.html"]')) {
      const target = new URL(link.href);
      target.searchParams.set('src', source);
      link.href = target.href;
    }
    return;
  }

  const plans = { '#plan-vault': 'base', '#plan-engine': 'pro' };
  const selected = plans[current.hash];
  if (selected) count('selected');
  for (const form of document.querySelectorAll('.buy-form')) {
    const plan = form.elements.namedItem('plan').value;
    form.addEventListener('formdata', ({ formData }) => {
      if (source !== 'direct') formData.set('src', source);
    });
    form.addEventListener('submit', () => {
      if (plan !== selected) count('selected');
    });
  }
})();
