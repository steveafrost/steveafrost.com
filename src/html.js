import React from 'react';
import { TypographyStyle, GoogleFont } from 'react-typography';
import typography from './utils/typography';

let stylesStr;
if (process.env.NODE_ENV === 'production') {
  try {
    stylesStr = require('!raw-loader!../public/styles.css');
  } catch (e) {
    console.log(e);
  }
}

let css;
if (process.env.NODE_ENV === 'production') {
  css = <style id="gatsby-inlined-css" dangerouslySetInnerHTML={{ __html: stylesStr }} />;
}

export default props => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {props.headComponents}
      <TypographyStyle typography={typography} />
      <GoogleFont typography={typography} />
      {css}
    </head>
    <body>
      <div
        id="___gatsby"
        dangerouslySetInnerHTML={{
          __html: props.body,
        }}
      />
      {props.postBodyComponents}
    </body>
  </html>
);
