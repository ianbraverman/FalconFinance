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
    const searchedLiability = await prisma.liabilities.findFirst({
      where: {
        id: +id,
      },
    });
    if (!searchedLiability) {
      return next({
        status: 401,
        message: "This liability does not exist. Please try again",
      });
    }

    if (searchedLiability.userId !== userId) {
      return next({
        status: 401,
        message:
          "You are not the user of this liability. You cannot delete this liability.",
      });
    }
    const deletedLiability = await prisma.liabilities.delete({
      where: {
        id: +id,
      },
    });
    res.json(deletedLiability);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, interest, liabilityType, monthlyPayment, amount } = req.body;

    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const userId = res.locals.user.id;

    const newLiability = await prisma.liabilities.create({
      data: {
        userId: userId,
        name: name,
        interest: +interest,
        liabilityType: liabilityType,
        monthlyPayment: +monthlyPayment,
        amount: +amount,
      },
    });
    res.json(newLiability);
  } catch (err) {
    next(err);
  }
});
