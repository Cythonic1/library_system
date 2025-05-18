import Layout from "@/components/auth/layout";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Book from "@/components/icons/book";

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { toast } from "@/hooks/use-toast";


interface FormData {
  username: string;
  email: string;
  password: string;
}
function SignUp() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });
  

  const {mutate,isPending} = useMutation({
    mutationFn: async()=>{
        console.log(formData);
        
        const respnse =await apiClient.post("/api/signup",formData);
        return respnse.data
    },
    onSuccess: () => {
      navigate('/sign-in');
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
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create a library account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Full Name</Label>
            <Input onChange={handleChange} type="text" id="username" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              onChange={handleChange}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
            onChange={handleChange}
            placeholder="****" id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/sign-in" className="text-primary hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default SignUp;
