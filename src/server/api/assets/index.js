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
    res.json(deletedAsset);
  } catch (e) {
    next(e);
  }
});
