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
    const searchedAsset = await prisma.assets.findFirst({
      where: {
        id: +id,
      },
    });
    if (!searchedAsset) {
      return next({
        status: 401,
        message: "This asset does not exist. Please try again",
      });
    }

    if (searchedAsset.userId !== userId) {
      return next({
        status: 401,
        message:
          "You are not the user of this asset. You cannot delete this asset.",
      });
    }
    const deletedAsset = await prisma.assets.delete({
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

    res.json(deletedAsset);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, assetType, balance, interest, contributions, physMon } =
      req.body;

    if (!res.locals.user) {
      return next({
        status: 400,
        message: "You are not logged into the correct account",
      });
    }
    const userId = res.locals.user.id;

    const newAsset = await prisma.assets.create({
      data: {
        userId: userId,
        name: name,
        assetType: assetType,
        balance: +balance,
        interest: +interest,
        contributions: +contributions,
        physMon: physMon,
      },
    });
    //this sets recommendationChangesMade to true, so that next time they go to the statistics page
    // they have made changes to their user profile so they are eligible to recieve a new
    // chatgpt recommendation
    await prisma.user.update({
      where: { id: userId },
      data: { recommendationChangesMade: true },
    });

    res.json(newAsset);
  } catch (err) {
    next(err);
  }
});
