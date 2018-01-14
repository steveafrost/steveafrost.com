import React, { Component } from 'react';
import Link from 'gatsby-link';
import { TypographyStyle } from 'react-typography';
import Nav from './components/Nav';
import typography from './utils/typography';
import customCSS from './css/custom.css';

let stylesStr;
if (process.env.NODE_ENV === `production`) {
    try {
        stylesStr = require(`!raw-loader!../public/styles.css`);
    } catch (e) {
        console.log(e);
    }
}

export default class HTML extends Component {
    render() {
        let css;
        if (process.env.NODE_ENV === `production`) {
            css = (
                <style
                    id="gatsby-inlined-css"
                    dangerouslySetInnerHTML={{ __html: stylesStr }}
                />
            );
        }

        return (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    {this.props.headComponents}
                    <TypographyStyle typography={typography} />
                    {css}
                </head>
                <body>
                    <div
                        id="___gatsby"
                        dangerouslySetInnerHTML={{
                            __html: this.props.body,
                        }}
                    />
                    {this.props.postBodyComponents}
                </body>
            </html>
        );
    }
}
