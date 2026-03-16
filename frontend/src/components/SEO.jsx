import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ data }) {
    if (!data) return null;

    const { name, title, tagline } = data.personalInfo;
    const siteUrl = window.location.origin;
    const description = tagline || `Professional portfolio of ${name}, ${title}.`;
    const image = data.personalInfo.profile_image || `${siteUrl}/og-image.png`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{`${name} | ${title}`}</title>
            <meta name="description" content={description} />

            {/* Facebook Meta Tags */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${name} | ${title}`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={siteUrl} />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${name} | ${title}`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
