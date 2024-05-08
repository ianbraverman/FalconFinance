const prisma = require("../../prisma");
const router = require("express").Router();
module.exports = router;

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const userId = res.locals.user.id;
    const searchedIncome = await prisma.income.findFirst({
      where: {
        id: +id,
      },
    });
    if (!searchedIncome) {
      return next({
        status: 401,
        message: "This income does not exist. Please try again",
      });
    }

    if (searchedIncome.userId !== userId) {
      return next({
        status: 401,
        message:
          "You are not the user of this income. You cannot delete this income.",
      });
    }
    const deletedIncome = await prisma.income.delete({
      where: {
        id: +id,
      },
    });
    res.json(deletedIncome);
  } catch (e) {
    next(e);
  }
});
