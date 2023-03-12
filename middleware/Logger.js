function consoleLogger(req, _res, next) {
    console.log(
        `${new Date().toLocaleString()} : ${req.method} at ${req.path} from ${
            req.ip
        }`
    );
    next();
}

export default consoleLogger;
