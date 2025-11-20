import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { signup } from '../lib/api.js';

const useSignUp = () => {
const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("Signup success", data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    // onError: () => {console.log(error)}
  });
 return { isPending, error, signupMutation: mutate}
}

export default useSignUp