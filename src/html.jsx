import React from 'react';
import { TypographyStyle, GoogleFont } from 'react-typography';
import typography from './utils/typography';

const getCSS = () => undefined;

export default ({ body, headComponents, postBodyComponents }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {headComponents}
      {getCSS()}
      <TypographyStyle typography={typography} />
      <GoogleFont typography={typography} />
    </head>
    <body>
      <div
        id="___gatsby"
        dangerouslySetInnerHTML={{
          __html: body,
        }}
      />
      {postBodyComponents}
    </body>
  </html>
);
