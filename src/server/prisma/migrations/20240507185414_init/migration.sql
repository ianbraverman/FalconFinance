-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('SAVINGS', 'CHECKING', 'INVESTMENT', 'IRA', 'ROTH_IRA', 'FOUR01K', 'CAR', 'HOUSE', 'COLLECTIBLE', 'OTHER');

-- CreateEnum
CREATE TYPE "PhysMon" AS ENUM ('PHYSICAL', 'MONETARY');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('SALARY', 'BONUS', 'COMMISSION', 'DIVIDENDS', 'INTEREST', 'RENTAL_INCOME', 'SIDE_HUSTLE', 'OTHER');

-- CreateEnum
CREATE TYPE "LiabilityType" AS ENUM ('CREDIT_CARD', 'STUDENT_LOAN', 'MORTGAGE', 'AUTO_LOAN', 'PERSONAL_LOAN', 'MEDICAL_DEBT', 'TAXES_OWNED', 'OTHER');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('SAVINGS', 'INVESTMENT', 'RETIREMENT', 'EDUCATION', 'DEBT_REDUCTION', 'EMERGENCY_FUND', 'TRAVEL', 'HOME_PURCHASE', 'OTHER');

-- CreateEnum
CREATE TYPE "GoalPriority" AS ENUM ('ASPIRATIONAL', 'IMPORTANT', 'NECESSARY');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('HOUSING', 'TRANSPORTATION', 'FOOD', 'UTILITIES', 'HEALTHCARE', 'INSURANCE', 'ENTERTAINMENT', 'EDUCATION', 'DEBT_PAYMENTS', 'PERSONAL_CARE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "age" INTEGER,
    "married" BOOLEAN,
    "retired" BOOLEAN,
    "retage" INTEGER,
    "retincome" INTEGER,
    "lifeexpect" INTEGER,
    "inflation" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assets" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetType" "AssetType" NOT NULL,
    "balance" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,
    "contributions" INTEGER NOT NULL,
    "physMon" "PhysMon" NOT NULL,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incomeType" "IncomeType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "yearlyIncrease" INTEGER NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liabilities" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interest" INTEGER NOT NULL,
    "liabilityType" "LiabilityType" NOT NULL,
    "monthlyPayment" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Liabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goals" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goalType" "GoalType" NOT NULL,
    "targetAge" INTEGER NOT NULL,
    "targetAmount" INTEGER NOT NULL,
    "goalPriority" "GoalPriority" NOT NULL,
    "savingsTowardAmount" INTEGER NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expenseType" "ExpenseType" NOT NULL,
    "monthlyCost" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liabilities" ADD CONSTRAINT "Liabilities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
