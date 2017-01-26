const webfonts = require('google-fonts')
const Driver = require('./components/Driver.jsx').default
Driver.execute();
webfonts.add({
  'Open Sans': ['300','400', '600', '700', '800']
})