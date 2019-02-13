var mongoose = require('mongoose');
mongoose.connect('mongodb://testi:testaaja2019@ds131765.mlab.com:31765/hangmangame', { useNewUrlParser: true })
    .then(
        () => {
            console.log('Yhdistetty tietokantaan');
        },
        err => {
            console.log(err);
        }
    );


    // mongodb://<dbuser>:<dbpassword>@ds131765.mlab.com:31765/hangmangame