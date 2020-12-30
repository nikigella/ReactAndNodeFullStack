module.exports = (req, res, next) => {
    // user is not logged in
    if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
    }

    //user is logged in
    next();
};