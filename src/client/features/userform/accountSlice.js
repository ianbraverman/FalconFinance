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
  }),
});

export const { useGetUserQuery, useDeleteInfoMutation, useAddAssetMutation } =
  accountApi;
