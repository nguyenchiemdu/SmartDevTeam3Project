class CertificateController {
    async certificate(req, res, next){
        res.render("certification/certification")
    }
}

module.exports = new CertificateController();
