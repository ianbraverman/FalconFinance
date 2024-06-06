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
    const searchedGoal = await prisma.goals.findFirst({
      where: {
        id: +id,
      },
    });
    if (!searchedGoal) {
      return next({
        status: 401,
        message: "This goal does not exist. Please try again",
      });
    }

    if (searchedGoal.userId !== userId) {
      return next({
        status: 401,
        message:
          "You are not the user of this goal. You cannot delete this goal.",
      });
    }
    const deletedGoal = await prisma.goals.delete({
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

    res.json(deletedGoal);
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      goalType,
      targetAge,
      targetAmount,
      goalPriority,
      savingsTowardAmount,
      alreadySaved,
      annualGrowthRate,
      goalDuration,
    } = req.body;

    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const userId = res.locals.user.id;

    const newGoal = await prisma.goals.create({
      data: {
        userId: userId,
        name: name,
        goalType: goalType,
        targetAge: +targetAge,
        targetAmount: +targetAmount,
        goalPriority: goalPriority,
        savingsTowardAmount: +savingsTowardAmount,
        alreadySaved: +alreadySaved,
        annualGrowthRate: +annualGrowthRate,
        goalDuration: +goalDuration,
      },
    });

    //this sets recommendationChangesMade to true, so that next time they go to the statistics page
    // they have made changes to their user profile so they are eligible to recieve a new
    // chatgpt recommendation
    await prisma.user.update({
      where: { id: userId },
      data: { recommendationChangesMade: true },
    });

    res.json(newGoal);
  } catch (err) {
    next(err);
  }
});
