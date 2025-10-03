import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Shield, TrendingUp, Users } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Custom debounce hook
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export default function Auth() {
  const { signIn, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Debounce the send OTP function to prevent rapid submissions
  const debouncedSendOtp = useDebounce(async (email: string) => {
    setLoading(true);
    const { error } = await signIn(email);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification code"
      });
    } else {
      setOtpSent(true);
      toast({
        title: "Code Sent",
        description: "Check your email for the 6-digit verification code (expires in 5 minutes)"
      });
    }
    
    setLoading(false);
  }, 1000); // 1-second debounce

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    debouncedSendOtp(email);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    setLoading(true);
    const { error } = await verifyOtp(email, otp);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid verification code"
      });
    } else {
      toast({
        title: "Success",
        description: "You have been signed in successfully"
      });
    }
    
    setLoading(false);
  };

  const handleResendOtp = () => {
    setOtp('');
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-3">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Elite Wealth</h1>
            <p className="text-lg font-medium text-primary">Management Suite</p>
          </div>
          <p className="text-muted-foreground text-sm">
            Secure access to your investment management platform
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center space-y-2">
            <div className="bg-success/10 rounded-full p-2 mx-auto w-fit">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Investment Tracking</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-primary/10 rounded-full p-2 mx-auto w-fit">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Client Management</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-warning/10 rounded-full p-2 mx-auto w-fit">
              <Shield className="h-4 w-4 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground">Secure Access</p>
          </div>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {otpSent ? 'Enter Verification Code' : 'Sign In'}
            </CardTitle>
            <CardDescription>
              {otpSent 
                ? 'Enter the 6-digit code we sent to your email'
                : 'Enter your email address to receive a verification code'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background border-border/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !email}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Code sent to <strong>{email}</strong>
                  </p>
                </div>
                
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || otp.length !== 6}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>
                </form>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Use Different Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Secured by enterprise-grade encryption</p>
        </div>
      </div>
    </div>
  );
}