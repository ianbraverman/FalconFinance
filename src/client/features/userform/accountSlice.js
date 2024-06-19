import { PhysMon } from "@prisma/client";
import api from "../../store/api";

const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * @description getUser query gets all of the information associated
     * with that user including assets, income, liabilities, goals, expenses.
     * @method GET
     */
    getUser: builder.query({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    getRecommendations: builder.query({
      query: () => "/user/recommendations",
      providesTags: ["User"],
    }),
    deleteInfo: builder.mutation({
      query: ({ id, table }) => ({
        url: `/${table}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    addAsset: builder.mutation({
      query: ({
        name,
        assetType,
        balance,
        interest,
        contributions,
        physMon,
      }) => ({
        url: `/assets`,
        method: "POST",
        body: {
          name: name,
          assetType: assetType,
          balance: balance,
          interest: interest,
          contributions: contributions,
          physMon: physMon,
        },
      }),
      invalidatesTags: ["User"],
    }),
    addExpense: builder.mutation({
      query: ({ name, expenseType, monthlyCost }) => ({
        url: `/expenses`,
        method: "POST",
        body: {
          name: name,
          expenseType: expenseType,
          monthlyCost: monthlyCost,
        },
      }),
      invalidatesTags: ["User"],
    }),
    addGoals: builder.mutation({
      query: ({
        name,
        goalType,
        targetAge,
        targetAmount,
        goalPriority,
        savingsTowardAmount,
        alreadySaved,
        annualGrowthRate,
        goalDuration,
        continueToSave,
      }) => ({
        url: `/goals`,
        method: "POST",
        body: {
          name: name,
          goalType: goalType,
          targetAge: targetAge,
          targetAmount: targetAmount,
          goalPriority: goalPriority,
          savingsTowardAmount: savingsTowardAmount,
          alreadySaved: alreadySaved,
          annualGrowthRate: annualGrowthRate,
          goalDuration: goalDuration,
          continueToSave: continueToSave,
        },
      }),
      invalidatesTags: ["User"],
    }),
    addIncome: builder.mutation({
      query: ({ name, incomeType, amount, yearlyIncrease }) => ({
        url: `/incomes`,
        method: "POST",
        body: {
          name: name,
          incomeType: incomeType,
          amount: amount,
          yearlyIncrease: yearlyIncrease,
        },
      }),
      invalidatesTags: ["User"],
    }),
    addLiability: builder.mutation({
      query: ({ name, interest, liabilityType, monthlyPayment, amount }) => ({
        url: `/liabilities`,
        method: "POST",
        body: {
          name: name,
          interest: interest,
          liabilityType: liabilityType,
          monthlyPayment: monthlyPayment,
          amount: amount,
        },
      }),
      invalidatesTags: ["User"],
    }),
    updatePersonalInfo: builder.mutation({
      query: ({
        firstname,
        lastname,
        age,
        retired,
        lifeexpect,
        inflation,
      }) => ({
        url: `/user/me`,
        method: "PATCH",
        body: {
          firstname: firstname,
          lastname: lastname,
          age: age,
          retired: retired,
          lifeexpect: lifeexpect,
          inflation: inflation,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useDeleteInfoMutation,
  useAddAssetMutation,
  useAddExpenseMutation,
  useAddGoalsMutation,
  useAddIncomeMutation,
  useAddLiabilityMutation,
  useUpdatePersonalInfoMutation,
  useGetRecommendationsQuery,
} = accountApi;
