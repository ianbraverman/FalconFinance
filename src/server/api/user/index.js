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
