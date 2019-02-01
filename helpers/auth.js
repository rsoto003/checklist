module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } else {
            req.flash("errorMessage", "Not authorized.");
            res.redirect('/users/login');
        }
    }
}