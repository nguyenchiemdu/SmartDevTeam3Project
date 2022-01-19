var authMiddleware = require("../middlerwares/auth.middleware");
const { userInfor } = require("../middlerwares/auth.middleware");

class CertificateController {
    async certificate(req, res, next){
        let userInfor = authMiddleware.userInfor(req);
        res.render("certification/certification", {
            ...authMiddleware.userInfor(req),
        })
    }
}

module.exports = new CertificateController();
