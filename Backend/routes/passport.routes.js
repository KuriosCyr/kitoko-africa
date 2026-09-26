const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getPassport, getSitePassport, checkIn, answerQuiz } = require("../controllers/passport.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/", getPassport);
router.get("/sites/:siteId", getSitePassport);
router.post("/sites/:siteId/checkin", checkIn);
router.post("/sites/:siteId/quiz", answerQuiz);

module.exports = router;
