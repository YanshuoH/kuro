
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index');
};

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