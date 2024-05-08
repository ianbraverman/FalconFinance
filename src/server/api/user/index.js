const prisma = require("../../prisma");
const router = require("express").Router();
module.exports = router;

router.get("/me", async (req, res, next) => {
  try {
    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const { id } = res.locals.user;
    const user = await prisma.user.findUnique({
      where: { id: +id },
      include: {
        Income: true,
        Assets: true,
        Liabilities: true,
        Goals: true,
        Expenses: true,
      },
    });
    if (!user) {
      return next({
        status: 400,
        message: `No user found with id ${id}`,
      });
    }
    res.json(user);
  } catch (e) {
    next(e);
  }
});
