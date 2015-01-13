
/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index');
};

exports.home = function(req, res) {
    res.render('home');
}

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.userPartials = function(req, res) {
    var name = req.params.name;
    res.render('partials/user/' + name);
}

exports.projectPartials = function(req, res) {
	var name = req.params.name;
	res.render('partials/project/' + name);
}

exports.taskPartials = function(req, res) {
	var name = req.params.name;
	res.render('partials/task/' + name);
}

exports.includePartials = function(req, res) {
    var name = req.params.name;
    res.render('partials/include/' + name);
}