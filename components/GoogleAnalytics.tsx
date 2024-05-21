// components/GoogleAnalytics.js

const GoogleAnalytics = () => {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-7X9MV6F6FJ"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7X9MV6F6FJ');
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;