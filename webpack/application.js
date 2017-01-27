const DateRange = require('date-range-js').default
const webfonts = require('google-fonts')
const Driver = require('./components/Driver.jsx').default
Driver.execute();
webfonts.add({
  'Lato': ['100','300','400', '700', '900']
})