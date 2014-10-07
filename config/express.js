var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');


module.exports = function(app, config) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.cookieParser());

    app.use(express.session());

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(morgan('dev'));
    app.use(express.favicon());
    app.use(app.router);

    app.use(express.static(path.join(__dirname, 'public')));
}