const express = require('express');
const app = express();
const cors = require('cors');
var path = require('path')
const bodyParser = require('body-parser');
const passport = require('passport');

// set up port
const PORT = process.env.PORT || 5000;

global.__basedir = __dirname
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors());
// add routes
const user = require('./routes/user.route');
const product = require('./routes/product.route');
const purch = require('./routes/purch.route');
const sell = require('./routes/sell.route');
const farmer = require('./routes/farmer.route');
const customer = require('./routes/customer.route');
const admin = require('./routes/admin.route');

require('./middleware/passport')


app.use(express.static(path.join(__dirname,'public')))

app.use('/auth',require('./routes/auth.route.js')); // before login 
app.use('/user',passport.authenticate('user_auth',{session:false}),user) // after login

app.use('/product', product);
app.use('/purch', purch );
app.use('/sell', sell);
app.use('/farmer', farmer);
app.use('/customer', customer);
app.use('/admin',  admin);


// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));