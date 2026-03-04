export default (req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
};
