module.exports = (router) => {
    router.get('/home', require('./home'));
    router.get('/newsroom', require('./newsroom'));
    router.get('/foia', require('./foia'));
};
