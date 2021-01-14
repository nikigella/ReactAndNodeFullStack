module.exports = (req, res, next) => {
    // user doesn't have enough credits
    if (req.user.credits < 1) {
        return res.status(403).send({ error: 'Not enough credits!' });
    }

    //above scenario is successful
    next();
};