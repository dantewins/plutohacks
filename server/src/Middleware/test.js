const minimalJwtMiddleware = () => {
    console.log('Minimal JWT middleware function created');
    return (req, res, next) => {
        console.log('Minimal JWT middleware executed');
        next();
    };
};

module.exports = { minimalJwtMiddleware };