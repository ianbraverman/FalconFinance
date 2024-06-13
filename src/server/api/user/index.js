const prisma = require("../../prisma");
const router = require("express").Router();
module.exports = router;
const getFinancialRecomendations = require("../openai");

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

router.patch("/me", async (req, res, next) => {
  try {
    const { firstname, lastname, age, retired, lifeexpect, inflation } =
      req.body;

    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const { id } = res.locals.user;

    // Convert retired to a boolean
    const retiredBoolean =
      retired === "true" || retired === true ? true : false;

    const updatedUser = await prisma.user.update({
      where: { id: +id },
      data: {
        firstname: firstname,
        lastname: lastname,
        age: +age,
        retired: retiredBoolean,
        lifeexpect: +lifeexpect,
        inflation: +inflation,
      },
    });

    if (!updatedUser) {
      return next({
        status: 401,
        message: "Update invalid, please try again",
      });
    }

    res.json(updatedUser);
  } catch (e) {
    next(e);
  }
});

router.get("/recommendations", async (req, res, next) => {
  try {
    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const userId = res.locals.user.id;
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Income: true,
        Assets: true,
        Liabilities: true,
        Goals: true,
        Expenses: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    //this checks to see if recommendationchangesmade is true, meaning that they have made a change to their profile that warrents a new ai search
    // if it is true, then it asks chatgpt for a recommendation, and updates the profile to have the recommendation
    // however, if recommndationChangesMade is false, then it does not search, and it just returns
    // the recommendation they already had
    if (user.recommendationChangesMade) {
      const recommendations = await getFinancialRecomendations(userProfile);

      await prisma.user.update({
        where: { id: userId },
        data: {
          recommendationChangesMade: false,
          recommendationContent: JSON.stringify(
            recommendations.message.content
          ),
        },
      });

      res.json(recommendations.message.content);
    } else {
      res.json(JSON.parse(user.recommendationContent));
    }
  } catch (e) {
    next(e);
  }
});
