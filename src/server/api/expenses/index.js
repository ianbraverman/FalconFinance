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
    const searchedExpense = await prisma.expenses.findFirst({
      where: {
        id: +id,
      },
    });
    if (!searchedExpense) {
      return next({
        status: 401,
        message: "This expense does not exist. Please try again",
      });
    }

    if (searchedExpense.userId !== userId) {
      return next({
        status: 401,
        message:
          "You are not the user of this expense. You cannot delete this expense.",
      });
    }
    const deletedExpense = await prisma.expenses.delete({
      where: {
        id: +id,
      },
    });

    //this sets recommendationChangesMade to true, so that next time they go to the statistics page
    // they have made changes to their user profile so they are eligible to recieve a new
    // chatgpt recommendation
    await prisma.user.update({
      where: { id: userId },
      data: { recommendationChangesMade: true },
    });

    res.json(deletedExpense);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, expenseType, monthlyCost, interest } = req.body;

    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const userId = res.locals.user.id;

    const newExpense = await prisma.expenses.create({
      data: {
        userId: userId,
        name: name,
        expenseType: expenseType,
        monthlyCost: +monthlyCost,
        interest: +interest,
      },
    });

    //this sets recommendationChangesMade to true, so that next time they go to the statistics page
    // they have made changes to their user profile so they are eligible to recieve a new
    // chatgpt recommendation
    await prisma.user.update({
      where: { id: userId },
      data: { recommendationChangesMade: true },
    });

    res.json(newExpense);
  } catch (err) {
    next(err);
  }
});
