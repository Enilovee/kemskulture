import { BLOGPOST_URL, BLOGPOST_UPLOAD } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts : builder.query({
            query: ({pageNumber}) => ({
                url: BLOGPOST_URL,
                params:{
                    pageNumber
                }
            }),
            keepUnusedDataFor : 5
        }),
        getPostDetails : builder.query({
            query: (blogPostId) => ({
                url: `${BLOGPOST_URL}/${blogPostId}`,
            }),
            keepUnusedDataFor : 5
        }),
       createPost : builder.mutation({
            query: () => ({
                url: BLOGPOST_URL,
                method: 'POST',
            }),
        }),
       updatePost : builder.mutation({
            query: (data) => ({
                url:`${BLOGPOST_URL}/${data.blogPostId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags:['Products'],
        }),
       uploadPostImage : builder.mutation({
            query: (data) => ({
                url: BLOGPOST_UPLOAD,
                method: 'POST',
                body: data,
            }),
            
        }),
      deletePost : builder.mutation({
            query: (blogPostId) => ({
                url: `${BLOGPOST_URL}/${blogPostId}`,
                method: 'DELETE',
            }),
            
        }),
        getTopPost : builder.query({
            query: () => ({
                url: `${BLOGPOST_URL}/top`,
            }),
    }),
        
})
})

export const {
    useGetPostsQuery, 
    useGetPostDetailsQuery, 
    useCreatePostMutation,
    useUpdatePostMutation,
    useUploadPostImageMutation,
    useDeletePostMutation, 
    useGetTopPostQuery,
} = productApiSlice;