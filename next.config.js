module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['*.ipfs.dweb.link'],
  },
  target: 'serverless',
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};
