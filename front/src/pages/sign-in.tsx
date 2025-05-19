import Layout from "@/components/auth/layout";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Book from "@/components/icons/book";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { toast } from "@/hooks/use-toast";


function SignIn() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  

  const {mutate,isPending} = useMutation({
    mutationFn: async()=>{        
        const respnse =await apiClient.post("/api/login",formData);
        return respnse.data
    },
    onSuccess: (data) => {
      navigate(`/otp/${data.email}`)          
    },
    onError: (error:any) => {
      toast({
        variant:"destructive",
        title:"Error",
        description:error.response.data.detail
      })
      console.error('Registration error:', error);
    }
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };


  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Book/>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to start reading!
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">username</Label>
            <Input id="username" onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input placeholder="***" onChange={handleChange} id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "sign in"}
          </Button>
        </form>
        <div className="text-center text-sm">
          Do not have accout yet?{" "}
          <a href="/sign-up" className="text-primary hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default SignIn;
