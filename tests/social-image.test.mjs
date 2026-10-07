import test from 'node:test';
import assert from 'node:assert/strict';
import { articleSocialImage, landscapeImage, resolveSocialImage } from '../src/lib/social-image.mjs';
const site = 'https://steveafrost.com';
test('landscape resolves to the actual existing PNG dimensions and absolute HTTPS URL', () => {
  const image = resolveSocialImage(landscapeImage.src, landscapeImage.alt, site);
  assert.equal(image.src, site + '/river-assets/river-full-bleed.png');
  assert.equal(image.width, 2172); assert.equal(image.height, 724); assert.equal(image.type, 'image/png');
});
test('article explicit image wins over a different inline image', () => {
  const image = articleSocialImage({ data: { title: 'Kindle', image: '/river-assets/kindle.png', imageAlt: 'Kindle illustration' }, body: '![other](/river-assets/parcel.png)' }, site);
  assert.equal(image.src, site + '/river-assets/kindle.png'); assert.equal(image.alt, 'Kindle illustration');
  assert.equal(image.width, 1536); assert.equal(image.height, 1024);
});
test('article can use an existing inline image and skips broken image references', () => {
  const image = articleSocialImage({ data: { title: 'Test' }, body: '![missing](/img/missing.jpg)\n![actual illustration](/river-assets/gif.png "GIFs")' }, site);
  assert.equal(image.src, site + '/river-assets/gif.png'); assert.equal(image.alt, 'actual illustration');
});
test('article with no usable image delegates to the landscape default', () => {
  assert.equal(articleSocialImage({ data: { title: 'Text article' }, body: 'Some writing.' }, site), null);
  assert.equal(articleSocialImage({ data: { title: 'Older article' }, body: '![lost](/assets/img/blogs/missing.jpg)' }, site), null);
});
test('external URLs and traversal cannot select files outside public', () => {
  assert.equal(resolveSocialImage('https://example.com/art.png', 'Other', site), null);
  assert.equal(resolveSocialImage('/%2e%2e%2fsrc/assets/navigation/github.svg', 'Invalid', site), null);
});
