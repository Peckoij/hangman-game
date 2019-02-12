var mongoose = require('mongoose');
mongoose.connect('mongodb://testi:testaaja2019@ds131765.mlab.com:29380/websk', { useNewUrlParser: true })
    .then(
        () => {
            console.log('Yhdistetty tietokantaan');
        },
        err => {
            console.log(err);
        }
    );