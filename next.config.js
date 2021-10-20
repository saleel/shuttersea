module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['*.ipfs.dweb.link'],
  },
  // target: 'serverless',
  // async rewrites() {
  //   return [
  //     // Rewrite everything to `pages/index`
  //     {
  //       source: '/:any*',
  //       destination: '/',
  //     },
  //   ];
  // },

  async redirects() {
    return [
      {
        source: '/loci',
        destination: 'https://hop.clickbank.net/?affiliate=direct2021&vendor=bbox231&tid=ga&page=2',
        permanent: true,
      },
    ];
  },
};
