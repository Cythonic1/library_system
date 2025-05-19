import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/auth/layout";
import apiClient from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";

export function OTP() {
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const navigate = useNavigate();
  const params = useParams();
  const email = params.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/verify-otp", {otp,email});

      let data = response.data;
      if (data.role == "admin" || data.role == "librarian") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      toast({
        title: "Success!",
        description: "OTP verified successfully.",
      });
    } catch (error: any) {

      toast({
        title: "Error",
        description: error.response.data.detail,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">OTP Verification</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        <div className="text-center text-sm">
          Didn't receive a code?{" "}
          <a href="/sign-in" className="underline" type="button">
            Resend OTP
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default OTP;
