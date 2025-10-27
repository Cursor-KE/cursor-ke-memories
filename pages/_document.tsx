import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/cursor-community-avatar.png" />
          <link rel="apple-touch-icon" href="/cursor-community-avatar.png" />
          <meta
            name="description"
            content="Relive amazing moments from Cursor Kenya events and meetups!"
          />
          <meta property="og:site_name" content="Cursor Kenya Memories" />
          <meta
            property="og:description"
            content="Relive amazing moments from Cursor Kenya events and meetups!"
          />
          <meta property="og:title" content="Cursor Kenya - Memories" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Cursor Kenya - Memories" />
          <meta
            name="twitter:description"
            content="Relive amazing moments from Cursor Kenya events and meetups!"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
