// Stub for url module
const url = {
  parse: (urlStr) => ({
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: null,
    path: null,
    href: urlStr
  }),
  format: (urlObj) => urlObj.href || '',
  resolve: (from, to) => to,
  URL: class URL {
    constructor(href) {
      this.href = href;
      this.protocol = '';
      this.hostname = '';
      this.port = '';
      this.pathname = '';
      this.search = '';
      this.hash = '';
    }
  }
};

module.exports = url;
module.exports.default = url;
